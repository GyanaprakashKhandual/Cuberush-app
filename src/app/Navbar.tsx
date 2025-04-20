'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Plus, Trash2, Edit, Menu, X, HomeIcon, UserCheck2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

 



type Bug = {
  id: number;
  moduleName: string;
  title: string;
  description: string;
  actualResult: string;
  expectedResult: string;
  requirement: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'Ongoing' | 'Solved' | 'Reopened';
  date: string;
};



type NewBug = Omit<Bug, 'id' | 'date'>;

export default function TestinnyApp() {
  const [inputValue, setInputValue] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [newBug, setNewBug] = useState<NewBug>({
    moduleName: '',
    title: '',
    description: '',
    actualResult: '',
    expectedResult: '',
    requirement: '',
    priority: 'Medium',
    status: 'New',
  });
  const [editBug, setEditBug] = useState<Bug | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bugToDelete, setBugToDelete] = useState<Bug | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bugs');
    if (saved) setBugs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('bugs', JSON.stringify(bugs));
  }, [bugs]);

  useEffect(() => {
    const savedName = localStorage.getItem('projectName');
    if (savedName) {
      setProjectName(savedName);
    }
  }, []);

  const addBug = () => {
    if (!newBug.title.trim()) return;
    const bug: Bug = {
      ...newBug,
      id: Date.now(),
      date: new Date().toLocaleString(),
    };
    setBugs([...bugs, bug]);
    setNewBug(initialBugState);
    setShowModal(false);
    
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      localStorage.setItem('projectName', inputValue);
      setProjectName(inputValue);
      setInputValue('');
    }
  };
  

  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  

  const editExistingBug = () => {
    if (!editBug) return;
    setBugs(bugs.map(b => (b.id === editBug.id ? { ...editBug, ...newBug } : b)));
    setEditBug(null);
    setNewBug(initialBugState);
    setShowModal(false);
  };

  const deleteBug = () => {
    if (!bugToDelete) return;
    setBugs(bugs.filter(b => b.id !== bugToDelete.id));
    setShowDeleteConfirm(false);
  };

  const initialBugState: NewBug = {
    title: '',
    moduleName: '',
    description: '',
    actualResult: '',
    expectedResult: '',
    requirement: '',
    priority: 'Medium',
    status: 'New',
  };

  const filteredBugs = bugs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase()) || b.status.toLowerCase().includes(search.toLowerCase()) || b.priority.toLowerCase().includes(search.toLowerCase()) 
  );

  const priorities: Record<Bug['priority'], string> = {
    High: 'border-red-600 bg-red-50 dark:bg-red-900/30',
    Medium: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30',
    Low: 'border-green-600 bg-green-50 dark:bg-green-900/30',
  };

  return (
    <div
      className={clsx(
        'min-h-screen transition-all duration-300',
        darkMode ? 'bg-[#0b1339] text-black' : 'bg-gray-100 text-black'
      )}
    >
      <nav className="fixed top-0 left-0 select-none w-full z-50 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-lg">
        <div className="w-full mx-auto px-4 py-3 flex justify-between">
          <div className="flex items-center space-x-4">
            <a><HomeIcon size={36}/></a>
            <h1 className="text-white text-2xl font-bold">🧪 Test Canvas</h1>
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search bugs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="rounded-xl px-4 py-2 outline-none w-180 bg-white text-black shadow placeholder-gray-500 focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <button
              onClick={() => {
                setNewBug(initialBugState);
                setEditBug(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-4 shadow transition-all hover:scale-105"
            >
              <Plus size={18} /> Add Bug
            </button>
            {!projectName ? (
        <input
          name="userName"
          id="userName"
          className="rounded-xl px-4 py-2 w-65 outline-none bg-white text-black shadow placeholder-gray-500 focus:ring-2 focus:ring-pink-400"
          placeholder="Project Name..."
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
        />
      ) : (
        <p className="mt-4 text-lg font-semibold text-white mb-3">
           {projectName}
        </p>
      )}
            <button><UserCheck2 size={36} className='text-white ml-3'/></button>
          </div>

          <div className="flex items-center">
            <button onClick={() => setDarkMode(!darkMode)} className="text-white">
              {darkMode ? <Sun size={36} /> : <Moon size={36} />}
            </button>
            <button
              onClick={() => setMobileOpen(prev => !prev)}  /* Toggle mobile search */
              className="md:hidden text-white"
            >
              {mobileOpen ? <X size={30} /> : <Menu size={30} />} {/* Show either Menu or Close icon */}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden px-4 py-2 bg-white dark:bg-gray-900"
            >
              <input
                type="text"
                placeholder="Search bugs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 mt-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main */}
      <main className="pt-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBugs.length === 0 && (
            <p className="text-center align-middle col-span-full mt-4 text-gray-500">No bugs found. Try adding one!</p>
          )}
          {filteredBugs.map(bug => (
            <motion.div
              key={bug.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={clsx('rounded-lg p-4 shadow-md border-l-4 mb-5', priorities[bug.priority])}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{bug.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditBug(bug);
                      setNewBug({ ...bug });
                      setShowModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setBugToDelete(bug);
                      setShowDeleteConfirm(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm mt-1"><b>Module:</b>{bug.moduleName}</p>
              <p className="text-sm mt-1"><b>Priority: </b>{bug.priority} | <b>Status: </b>{bug.status} | 🕒 {bug.date}</p>
              <p className="text-sm mt-2"><b>Bug Description:</b>{bug.description}</p>
              <p className="text-sm"><b className='text-red-500'>Actual Result: </b>{bug.actualResult}</p>
              <p className="text-sm"><b className='text-green-500'>Expected Result: </b>{bug.expectedResult}</p>
              <p className="text-sm"><b className='text-amber-500'>Requirement: </b>{bug.requirement}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-300"
            >
              <h3 className="text-xl font-bold mb-4">{editBug ? 'Edit Bug' : 'Add New Bug'}</h3>
              {['title', 'moduleName', 'description', 'actualResult', 'expectedResult', 'requirement'].map(field => (
                <textarea
                  key={field}
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={(newBug as any)[field]}
                  onChange={e => setNewBug({ ...newBug, [field]: e.target.value })}
                  className="w-full px-3 py-2 mb-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none"
                />
              ))}
              <select
                value={newBug.priority}
                onChange={e => setNewBug({ ...newBug, priority: e.target.value as Bug['priority'] })}
                className="w-full px-3 py-2 mb-3 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <select
                value={newBug.status}
                onChange={e => setNewBug({ ...newBug, status: e.target.value as Bug['status'] })}
                className="w-full px-3 py-2 mb-3 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <option value="New">New</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Solved">Solved</option>
                <option value="Reopened">Reopened</option>
              </select>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={editBug ? editExistingBug : addBug}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editBug ? 'Update Bug' : 'Add Bug'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm"
            >
              <h3 className="text-xl font-bold mb-4">Delete this bug?</h3>
              <p className="text-sm mb-4">This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                  Cancel
                </button>
                <button onClick={deleteBug} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
