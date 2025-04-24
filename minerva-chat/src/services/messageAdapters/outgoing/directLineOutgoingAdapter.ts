import { DirectLine } from 'botframework-directlinejs';

class DirectLineOutgoingAdapter {
  private directLine: DirectLine | null;

  constructor() {
    this.directLine = null;
  }

  initialize(): void {
    const directLineSecret = 'YOUR_DIRECT_LINE_SECRET';
    this.directLine = new DirectLine({
      secret: directLineSecret,
    });
  }

  async send(text: string): Promise<void> {
    if (!this.directLine) {
      throw new Error('DirectLine not initialized');
    }

    await this.directLine
      .postActivity({
        from: { id: 'user', name: 'User' },
        type: 'message',
        text: text,
      })
      .subscribe(
        (id) => console.log('Posted activity, assigned ID', id),
        (error) => console.error('Error posting activity', error)
      );
  }

  disconnect(): void {
    if (this.directLine) {
      this.directLine.end();
      this.directLine = null;
    }
  }
}

export default DirectLineOutgoingAdapter;
