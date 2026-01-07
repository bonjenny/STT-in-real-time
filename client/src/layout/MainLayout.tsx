import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, rightPanel }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left/Main Panel: Editor */}
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>

      {/* Right Panel: Chatbot / Extras */}
      <aside className="w-80 border-l bg-white hidden lg:flex flex-col">
        <div className="p-4 border-b font-bold text-gray-700">AI Assistant</div>
        <div className="flex-1 p-4 overflow-y-auto">
          {rightPanel || (
            <div className="text-sm text-gray-400">
              AI Chatbot features coming soon...
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
