import PageTitle from "@/components/ui/PageTitle";
import SectionCard from "@/components/ui/SectionCard";
import UsersPage from "./components/UsersPage";
import { getUsers } from "@/lib/users";

export default async function UsersPageContainer() {
    const users = await getUsers();

    return (
        <div className="p-8">
            <PageTitle
                title="Utilisateurs"
                description="Gestion des utilisateurs"
            />

            <SectionCard>
                <UsersPage usersProps={users}></UsersPage>
            </SectionCard>
        </div>
    );
}