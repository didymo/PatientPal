import {animate, animateChild, group, query, style, transition, trigger} from '@angular/animations';

export const slideInAnimation =
    trigger('routeAnimations', [
        transition('TabViews <=> Editor', [
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({right: '-100%'})
            ]),
            query(':leave', animateChild()),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({right: '100%'}))
                ]),
                query(':enter', [
                    animate('300ms ease-out', style({right: '0%'}))
                ])
            ]),
            query(':enter', animateChild()),
        ])
    ]);
