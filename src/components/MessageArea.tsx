import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Calendar, Send, Image, Video, Check, CheckCheck, 
  MoreVertical, Reply, Star, Copy, Trash2, Forward,
  Smile, Paperclip, Mic
} from 'lucide-react';
import { format } from 'date-fns';

const MessageArea = () => {
  const { templates, createCampaign, selectedContact, messages, addMessage, updateMessageStatus } = useStore();
  const [selectedTemplate, setSelectedTemplate] = React.useState('');
  const [scheduledDate, setScheduledDate] = React.useState('');
  const [mediaFiles, setMediaFiles] = React.useState<File[]>([]);
  const [messageText, setMessageText] = React.useState('');
  const [selectedMessage, setSelectedMessage] = React.useState<string | null>(null);
  const messageEndRef = React.useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(files);
  };

  const handleSend = () => {
    if ((!selectedTemplate && !messageText) || !selectedContact) return;

    const newMessage = {
      id: crypto.randomUUID(),
      contactId: selectedContact.id,
      campaignId: crypto.randomUUID(),
      content: messageText || selectedTemplateData?.content || '',
      status: 'pending' as const,
      timestamp: new Date(),
      media: mediaFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video'
      }))
    };

    addMessage(newMessage);
    setMessageText('');
    setMediaFiles([]);

    // Simulate message status updates
    setTimeout(() => updateMessageStatus(newMessage.id, 'sent'), 1000);
    setTimeout(() => updateMessageStatus(newMessage.id, 'delivered'), 2000);
    setTimeout(() => updateMessageStatus(newMessage.id, 'read'), 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const MessageActions = ({ messageId }: { messageId: string }) => (
    <div className="absolute right-0 top-0 mt-2 mr-2 bg-white rounded-lg shadow-lg p-2 z-10">
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
        <Reply size={16} /> Reply
      </button>
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
        <Forward size={16} /> Forward
      </button>
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
        <Star size={16} /> Star
      </button>
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
        <Copy size={16} /> Copy
      </button>
      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-500 flex items-center gap-2">
        <Trash2 size={16} /> Delete
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">
            {selectedContact ? selectedContact.name : 'New Campaign'}
          </h2>
          {selectedContact && (
            <p className="text-sm text-gray-600">{selectedContact.phone}</p>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreVertical size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_04be3e38c73e4712e8edebac54beed49.png')] bg-repeat">
        {selectedContact && messages
          .filter(m => m.contactId === selectedContact.id)
          .map(message => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.contactId === selectedContact.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] rounded-lg p-3 relative group ${
                  message.contactId === selectedContact.id ? 'bg-green-500 text-white' : 'bg-white'
                }`}
                onMouseEnter={() => setSelectedMessage(message.id)}
                onMouseLeave={() => setSelectedMessage(null)}
              >
                {message.media?.map((media, index) => (
                  <div key={index} className="mb-2">
                    {media.type === 'image' ? (
                      <img src={media.url} alt="" className="rounded-lg max-w-full" />
                    ) : (
                      <video src={media.url} controls className="rounded-lg max-w-full" />
                    )}
                  </div>
                ))}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs opacity-75">
                    {format(message.timestamp, 'HH:mm')}
                  </span>
                  {message.status === 'sent' && <Check size={16} />}
                  {message.status === 'delivered' && <CheckCheck size={16} className="opacity-75" />}
                  {message.status === 'read' && <CheckCheck size={16} className="text-blue-400" />}
                </div>
                {selectedMessage === message.id && <MessageActions messageId={message.id} />}
              </div>
            </div>
          ))}
        <div ref={messageEndRef} />

        {selectedTemplateData && (
          <div className="bg-white p-4 rounded-lg mb-4 border">
            <h3 className="font-medium mb-2">Template Preview</h3>
            {selectedTemplateData.mediaUrl && (
              <div className="mb-2">
                {selectedTemplateData.mediaType === 'image' ? (
                  <img src={selectedTemplateData.mediaUrl} alt="" className="rounded-lg max-w-full" />
                ) : (
                  <video src={selectedTemplateData.mediaUrl} controls className="rounded-lg max-w-full" />
                )}
              </div>
            )}
            <p className="text-gray-600">{selectedTemplateData.content}</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Choose a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Smile size={24} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip size={24} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="w-full p-2 border rounded-lg resize-none"
              rows={1}
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Mic size={24} className="text-gray-600" />
          </button>
          <button
            onClick={handleSend}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            <Send size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Add Media (Optional)
          </label>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
              <Image size={20} className="text-gray-400" />
              <span className="text-sm text-gray-600">Add Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
              <Video size={20} className="text-gray-400" />
              <span className="text-sm text-gray-600">Add Video</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Schedule (Optional)
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full p-2 border rounded-lg pl-10"
            />
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;