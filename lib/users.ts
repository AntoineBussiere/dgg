import { User } from "@/types/user";
import { redis, redisPrefix } from "./redis";
import { hash } from "./bcrypt";

export async function getUsers() {
    const users = await redis.get(redisPrefix + 'users') as User[];
    return users;
}

export async function getUser(username: string) {
    const users = await getUsers();
    return users.find(x => x.username === username);
}

export async function setUsers(users: User[]) {
    redis.set(redisPrefix + 'users', users);
}

export async function createUser(username: string, password: string) {
    const users = await getUsers();

    if (users.find(x => x.username === username)) {
        throw new Error('Username already exists');
    }

    const hashValue = await hash(password);

    users.push({
        username,
        hash: hashValue
    });

    await setUsers(users);

    return users;
}

export async function resetPassword(username: string, password: string) {
    const users = await getUsers();
    
    const hashValue = await hash(password);

    const userIndex = users.findIndex(x => x.username === username);

    if(userIndex) {
        users[userIndex] = {
            username,
            hash: hashValue
        };

        await setUsers(users);
    }

    return users;
}

export async function deleteUser(username: string) {
    let users = await getUsers();

    if (username && users.length > 1) {
        users = users.filter(x => x.username !== username);
    }

    await setUsers(users);

    return users;
}