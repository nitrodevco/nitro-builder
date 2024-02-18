import { createRoot } from 'react-dom/client';
import { NitroBuilderComponent } from './components';
import './index.css';

declare global
{
    interface Window
    {
        NitroBuilderConfig: { [key: string]: any };
    }
}

window.NitroBuilderConfig = window.NitroBuilderConfig || {};

createRoot(document.getElementById('root')).render(<NitroBuilderComponent />);
