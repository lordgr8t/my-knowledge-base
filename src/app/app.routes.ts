import { Routes } from '@angular/router';
import { Home } from './layout/home/home';
import { Auth } from './layout/auth/auth';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        data: {
            headerState: 'home'
        }
    },
    {
        path: 'auth',
        component: Auth,
        data: {
            headerState: 'auth'
        }
    }
];
