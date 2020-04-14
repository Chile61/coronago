import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ConfirmDisclaimerGuard } from '../../guards/confirm-disclaimer.guard';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        canActivateChild: [ConfirmDisclaimerGuard],
        children: [
            {
                path: 'score',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../score/score.module').then((m) => m.ScoreModule),
                    },
                ],
            },
            {
                path: 'score-log',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../score-log/score-log.module').then((m) => m.ScoreLogModule),
                    },
                ],
            },
            {
                path: 'ticker',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../ticker/ticker.module').then((m) => m.TickerModule),
                    },
                ],
            },
            {
                path: 'infection',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../infection/infection.module').then((m) => m.InfectionModule),
                    },
                ],
            },
            {
                path: 'message-box',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../message-box/message-box.module').then((m) => m.MessageBoxModule),
                    },
                ],
            },
            {
                path: 'info',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../info/info.module').then((m) => m.InfoModule),
                    },
                ],
            },
            {
                path: 'debug',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../debug/debug.module').then((m) => m.DebugModule),
                    },
                ],
            },
            {
                path: '',
                redirectTo: '/tabs/score',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/tabs/score',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TabsPageRoutingModule {}
