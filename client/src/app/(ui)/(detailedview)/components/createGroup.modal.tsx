'use client'

import { createClient } from '@/supabase/client'
import { useState } from 'react'
import { useUser } from '@/contexts/UserContext';
import { group } from 'console';

export default function CreateGroupModal({ onCloseCreate, onCloseQuit, festival_id }: { onCloseCreate: (newGroups: Record<number, { name: string; member_count: number }>) => void, onCloseQuit: () => void, festival_id: number }) {
  const supabase = createClient();
  const { profile } = useUser();

  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('festivalgroups')
                .insert([{ name: groupName, festival_id: festival_id }])
                .select('id')
                .single();
            if (error) {
                console.error('Error creating group:', error.message);
            } else {
                const { error: groupError } = await supabase
                    .from('usergroups')
                    .insert([{ user_id: profile!.id, group_id: data.id }]);
                if (groupError) {
                    console.error('Error adding user to group:', groupError.message);
                } else {
                    console.log('Group created and user added successfully');
                    const newGroupData: Record<number, { name: string; member_count: number }> = {
                        [data.id]: {
                            name: groupName,
                            member_count: 1
                        }
                    };
                    onCloseCreate(newGroupData);
                }
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    }

  return (
    <>      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onCloseQuit}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Group</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                id="name"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 outline-none"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Create Group"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}