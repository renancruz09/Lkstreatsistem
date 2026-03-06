// Sistema de autenticação simples usando localStorage

interface User {
  username: string;
  password: string;
  name: string;
}

class AuthService {
  private AUTH_KEY = 'lk_street_auth';
  private USERS_KEY = 'lk_street_users';

  constructor() {
    this.initializeUsers();
  }

  private initializeUsers() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers: User[] = [
        { username: 'admin', password: 'admin123', name: 'Administrador' },
        { username: 'gerente', password: 'gerente123', name: 'Gerente' },
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
  }

  login(username: string, password: string): { success: boolean; error?: string; user?: { username: string; name: string } } {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return { success: false, error: 'Usuário ou senha incorretos' };
    }

    const authData = {
      username: user.username,
      name: user.name,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
    return { success: true, user: { username: user.username, name: user.name } };
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) !== null;
  }

  getCurrentUser(): { username: string; name: string } | null {
    const data = localStorage.getItem(this.AUTH_KEY);
    if (!data) return null;
    
    try {
      const user = JSON.parse(data);
      return { username: user.username, name: user.name };
    } catch {
      return null;
    }
  }

  addUser(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    
    if (users.find(u => u.username === user.username)) {
      return false; // Usuário já existe
    }

    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }
}

export const auth = new AuthService();
