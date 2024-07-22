// components/advices/advices_button.tsx
import React, { useRef } from 'react';
import { Button } from '@nextui-org/react';
import { IoNotificationsOutline } from 'react-icons/io5';
import confetti from 'canvas-confetti';

const NotificationButton = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const unreadMessages = 8; 
    const handleConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    };

    return (
        <div className="relative">
            <Button
                ref={buttonRef}
                disableRipple
                className="relative overflow-visible rounded-full hover:-translate-y-1 px-2 py-2 shadow-lg bg-background/30"
                size="sm"
                onPress={handleConfetti}
            >
                <IoNotificationsOutline className="text-xl text-white" />
            </Button>
            {unreadMessages > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadMessages}
                </span>
            )}
        </div>
    );
};

export default NotificationButton;
