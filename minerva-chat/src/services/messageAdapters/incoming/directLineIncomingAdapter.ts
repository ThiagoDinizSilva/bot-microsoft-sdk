// src/services/messageAdapters/incoming/directLineIncomingAdapter.ts
import { DirectLine } from 'botframework-directlinejs';
import { MessageCallback, StatusCallback } from 'types';

class DirectLineIncomingAdapter {
  private directLine: DirectLine | null;
  private messageCallback: MessageCallback | null;
  private statusCallback: StatusCallback | null;

  constructor() {
    this.directLine = null;
    this.messageCallback = null;
    this.statusCallback = null;
  }

  initialize(
    messageCallback: MessageCallback,
    statusCallback: StatusCallback,
    config: { secret: string }
  ): void {
    this.messageCallback = messageCallback;
    this.statusCallback = statusCallback;

    this.directLine = new DirectLine({
      secret: config.secret,
    });

    this.directLine.connectionStatus$.subscribe((status: any) => {
      this.statusCallback?.(status);
    });

    this.directLine.activity$.subscribe((activity: any) => {
      if (activity.from.id !== 'user' && activity.text) {
        this.messageCallback?.({
          text: activity.text,
        });
      }
    });
  }

  disconnect(): void {
    if (this.directLine) {
      this.directLine.end();
      this.directLine = null;
    }
  }
}

export default DirectLineIncomingAdapter;
