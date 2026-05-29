'use client'

import { useState } from "react";
import { User } from "@/types/user";
import { ActionButton } from "@/components/ui/ActionButton";
import Modal from "@/components/modal/Modal";
import UserRow from "./UserRow";
import UserForm from "./UserForm";

type Props = {
    usersProps: User[]
};

export default function UsersPage({usersProps}: Props) {
    const [users, setUsers] = useState<User[]>(usersProps);
    const [open, setOpen] = useState(false);

    function handleAdd(users: User[]) {
        setUsers(users);
        setOpen(false);
    }

    function handleDelete(username: string) {
        setUsers(users => users.filter(user => user.username !== username));
    }

    return (
        <div>
            <div className="pb-3 flex items-center justify-between ">
                <span className="text-sm text-slate-400">
                    {users.length} utilisateur{users.length > 1 ? 's' : ''}
                </span>
                <ActionButton variant="success" onClick={() => setOpen(true)}>
                    Ajouter un utilisateur
                </ActionButton>
            </div>
            <div className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                divide-y
                divide-white/10
            ">
                {users.map(user => 
                    <UserRow key={user.username} user={user} onDelete={() => handleDelete(user.username)}></UserRow>
                )}
            </div>
            <Modal
                open={open}
                title="Créer un utilisateur"
                onClose={() => setOpen(false)}
            >
                <UserForm onAdd={(newUsers: User[]) => handleAdd(newUsers)}></UserForm>
            </Modal>
        </div>
    );
}