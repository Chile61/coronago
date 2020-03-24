import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ConfirmDisclaimerGuard } from './guards/confirm-disclaimer.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/tabs/tabs.module').then(m => m.TabsPageModule),
        canActivate: [ConfirmDisclaimerGuard]
    },
    {
        path: 'disclaimer',
        loadChildren: () => import('./modules/confirm-disclaimer/confirm-disclaimer.module').then(m => m.ConfirmDisclaimerModule)
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
