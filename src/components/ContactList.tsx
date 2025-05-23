import React from 'react';
import { useStore } from '../store/useStore';
import { Upload, Circle, Plus, Check, Filter } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ContactList = () => {
  const {
    contacts,
    addContact,
    fetchContacts,
    setSelectedContact,
    categories,
    selectedCategory,
    setSelectedCategory,
    toggleContactSelection,
    selectAllContacts,
    addCategory,
  } = useStore();

  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryColor, setNewCategoryColor] = React.useState('#4CAF50');
  const [showFilters, setShowFilters] = React.useState(false);

  // ✅ Fetch contacts on first load
  React.useEffect(() => {
    fetchContacts();
  }, []);

  // ✅ Handle Excel file upload and save to MongoDB
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const newContacts = jsonData.map((row: any) => ({
        name: row.name || '',
        number: row.phone || '',
        category: row.category || '',
      }));

      newContacts.forEach((contact) => {
        addContact(contact);
      });

      fetchContacts(); // ✅ Refresh list after upload
    };

    reader.readAsArrayBuffer(file);
  }, [addContact, fetchContacts]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({
        id: crypto.randomUUID(),
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });
      setNewCategoryName('');
      setShowCategoryModal(false);
    }
  };

  // ✅ Filter contacts by selected category
  const filteredContacts = contacts.filter(
    (contact) => !selectedCategory || contact.category === selectedCategory
  );

  const selectedCount = filteredContacts.filter((c) => c.selected).length;

  return (
    <div className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Contacts</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Filter size={20} />
            </button>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id || category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer
            ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Drop Excel file here or click to upload
          </p>
        </div>

        {selectedCount > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedCount} contact{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => selectAllContacts(false, selectedCategory)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        <div className="p-2 border-b bg-gray-50 flex items-center">
          <input
            type="checkbox"
            checked={filteredContacts.every((c) => c.selected)}
            onChange={(e) => selectAllContacts(e.target.checked, selectedCategory)}
            className="mr-3"
          />
          <span className="text-sm text-gray-600">Select All</span>
        </div>

        {filteredContacts.map((contact) => (
          <div
            key={contact.id || contact._id}
            className="p-4 border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={contact.selected}
                onChange={() => toggleContactSelection(contact.id || contact._id)}
                className="mt-1"
              />
              <div className="flex-1" onClick={() => setSelectedContact(contact)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.number}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-1">
                  {contact.category && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {contact.category}
                    </span>
                  )}
                  {contact.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter category name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Color</label>
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-full p-1 border rounded-lg h-10"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
