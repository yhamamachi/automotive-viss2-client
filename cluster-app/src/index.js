import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';

import ClusterApp from './ClusterApp'

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
    <StrictMode>
        <div className="ClusterApp">
            <ClusterApp />
        </div>
    </StrictMode>
  );