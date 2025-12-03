'use client';

import LoginModal from '@/auth/ui/login.modal';
import { useState } from 'react';

export default function LoginButton() {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    return (
        <div>
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg transition-colors cursor-pointer"
                onClick={() => setIsLoginModalOpen(true)}
            >
                Login
            </button>
            {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
        </div>
    );  
}