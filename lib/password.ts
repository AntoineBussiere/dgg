export function passwordGenerator(size: number): string {
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for(let i = 0; i < size; i++) {
        const char = Math.floor(Math.random() * str.length + 1);
        password += str.charAt(char);
    }

    return password;
}