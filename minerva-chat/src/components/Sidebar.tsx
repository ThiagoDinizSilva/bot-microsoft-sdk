import { FC } from 'react';
import { SidebarProps } from '../types';

const Sidebar: FC<SidebarProps> = ({ isConnected = true }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      <div className="contact">
        <div className="contact-avatar">B</div>
        <div className="contact-info">
          <div className="contact-name">Bot</div>
          <div className="contact-status">{isConnected ? 'Online' : 'Offline'}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
