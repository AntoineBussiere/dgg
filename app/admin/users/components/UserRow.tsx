'use client'

import Modal from "@/components/modal/Modal";
import { ActionButton } from "@/components/ui/ActionButton";
import { passwordGenerator } from "@/lib/password";
import { User } from "@/types/user";
import { useState } from "react";

type Props = {
    user: User;
    onDelete: () => void
};

export default function UserRow({user, onDelete}: Props) {
    const [reseting, setReseting] = useState(false);
    const [isPasswordCopied, setIsPasswordCopied] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [open, setOpen] = useState(false);

    function copyPassword() {
        navigator.clipboard.writeText(generatedPassword);
        setIsPasswordCopied(true);
        setTimeout(() => {
            setIsPasswordCopied(false);
        }, 2000);
    }

    async function resetUser() {
        setReseting(true);
        const password = passwordGenerator(10);
        setGeneratedPassword(password);

        await fetch("/api/users/" + user.username, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user.username, password }),
        });

        setTimeout(() => {
            setReseting(false);
        }, 30000);
    }

    async function deleteUser() {
        await fetch("/api/users/" + user.username, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        onDelete();
    }

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }

    return (
        <div className="
            flex
            items-center
            justify-between
            px-4
            py-3
        ">
            <span className="flex-grow-1">{user.username}</span>
            {reseting ? (
                <div className="
                    flex
                    items-center
                    px-2
                ">
                    <input
                        type="text"
                        value={generatedPassword}
                        disabled
                        className="
                            flex-1
                            rounded-l-lg
                            border
                            border-white/10
                            bg-white/5
                            px-4
                            py-2
                            text-sm
                            text-slate-200
                            outline-none
                        "
                    />

                    <div className="relative group">
                        <button
                            type="button"
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-r-lg
                                border
                                border-blue-500/30
                                bg-blue-500/10
                                text-blue-200
                                transition-all
                                hover:bg-blue-500/20
                                hover:border-blue-400/40
                                active:scale-[0.97]
                            "
                            onClick={copyPassword}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                            >
                                <rect
                                    x="9"
                                    y="9"
                                    width="13"
                                    height="13"
                                    rx="2"
                                />

                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        </button>

                        

                        {isPasswordCopied ? (
                            <div className="
                                absolute
                                -left-9
                                top-1
                                -translate-x-1/2
                                whitespace-nowrap
                                rounded-lg
                                border
                                border-emerald-500/20
                                bg-emerald-500/10
                                px-3
                                py-1.5
                                text-xs
                                text-emerald-200
                                shadow-lg
                                backdrop-blur-lg
                            ">
                                Copié !
                            </div>
                        ) : (
                            <div className="
                                pointer-events-none
                                absolute
                                -top-10
                                left-1/2
                                -translate-x-1/2
                                whitespace-nowrap
                                rounded-lg
                                border
                                border-white/10
                                bg-slate-900/95
                                px-3
                                py-1.5
                                text-xs
                                text-slate-200
                                opacity-0
                                transition-opacity
                                duration-200
                                group-hover:opacity-100
                            ">
                                Copier le mot de passe
                            </div>
                        )}
                        
                    </div>
                </div>
            ) : (
                <div className="px-2">
                    <ActionButton variant="warning" onClick={resetUser}>
                        Changer le mot de passe
                    </ActionButton>
                </div>
            )}

            <ActionButton variant="danger" onClick={openModal}>
                Supprimer
            </ActionButton>
            <Modal
                open={open}
                title="Supprimer un utilisateur"
                onClose={() => setOpen(false)}
            >
                <span>Vous êtes sur le point de supprimer l'utilisateur <i>{user.username}</i>. La validation entraînera sa suppression définitive.</span>
                <div className="flex mt-4">
                    <button
                        type="submit"
                        className="w-50 text-gray-200 bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20 hover:border-gray-400/40 py-2 rounded mx-2"
                        onClick={closeModal}
                    >Annuler</button>
                    <button
                        type="submit"
                        className="w-50 text-red-200 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-400/40 py-2 rounded mx-2"
                        onClick={deleteUser}
                    >Supprimer</button>
                </div>
            </Modal>
        </div>
    );
}