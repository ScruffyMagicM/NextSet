'use client'

import { createClient } from '@/auth/supabase/client';
import { useState } from 'react';

//#TODO Figure out how to better size the upload PFP button

export default function PfpUpload({ 
  userId, 
  currentPfpUrl,
  setPfpUrlInParent,
  locked = true 
}: { 
  userId: string
  currentPfpUrl?: string,
  setPfpUrlInParent: (newUrl: string) => void,
  locked?: boolean
}) {
  const [uploading, setUploading] = useState(false);
  const [pfpUrl, setPfpUrl] = useState(currentPfpUrl);
  const supabase = createClient();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      //TODO: Generate unique file names to avoid caching issues
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = `${userId}/pfp-${uniqueSuffix}.${fileExt}`;
      const filePath = fileName;

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('pfp-images')
        .upload(filePath, file, { 
          upsert: true // Overwrites if exists
        })

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pfp-images')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('userprofiles')
        .update({ pfp_url: publicUrl })
        .eq('id', userId)

        if (updateError) {
            throw updateError
      }

      setPfpUrl(publicUrl)
      setPfpUrlInParent(publicUrl);
      alert('Profile picture uploaded successfully!')
    } catch (error) {
        if (typeof error === "string") {
            alert(`Error uploading profile picture: ${error.toUpperCase()}`);
        } else if (error instanceof Error) {
            alert(`Error uploading profile picture: ${error.message}`);
        }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {pfpUrl ? (
        <img
          src={pfpUrl}
          alt="Profile Picture"
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500">No profile picture</span>
        </div>
      )}

      <label hidden={locked} className="w-64 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        {uploading ? 'Uploading...' : 'Upload Profile Picture'}
        <input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  )
}