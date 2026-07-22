import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-not-found', standalone: true, imports: [RouterModule], template: `<main class="grid min-h-screen place-items-center bg-slate-950 px-4 pt-20 text-center text-white"><div><p class="text-sm font-bold uppercase tracking-[.3em] text-sky-400">404</p><h1 class="mt-4 text-5xl font-black">This page wandered off.</h1><p class="mt-4 text-slate-300">Let’s get you back to the good stuff.</p><a routerLink="/" class="mt-8 inline-block rounded-xl bg-sky-500 px-6 py-3 font-bold text-white">Return home</a></div></main>` })
export class NotFoundComponent {}
