import { trigger, state, style, transition, animate, keyframes, query, stagger, group } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  state('in', style({ opacity: 1 })),
  state('out', style({ opacity: 0 })),
  transition('in => out', animate('300ms ease-out')),
  transition('out => in', animate('300ms ease-in'))
]);

export const slideInOut = trigger('slideInOut', [
  state('in', style({ transform: 'translateX(0)', opacity: 1 })),
  state('out', style({ transform: 'translateX(-100%)', opacity: 0 })),
  transition('in => out', animate('300ms ease-in-out')),
  transition('out => in', animate('300ms ease-in-out'))
]);

export const slideUpDown = trigger('slideUpDown', [
  state('in', style({ transform: 'translateY(0)', opacity: 1 })),
  state('out', style({ transform: 'translateY(100%)', opacity: 0 })),
  transition('in => out', animate('300ms ease-in-out')),
  transition('out => in', animate('300ms ease-in-out'))
]);

export const scaleInOut = trigger('scaleInOut', [
  state('in', style({ transform: 'scale(1)', opacity: 1 })),
  state('out', style({ transform: 'scale(0)', opacity: 0 })),
  transition('in => out', animate('200ms ease-in')),
  transition('out => in', animate('200ms ease-out'))
]);

export const rotateInOut = trigger('rotateInOut', [
  state('in', style({ transform: 'rotate(0deg)', opacity: 1 })),
  state('out', style({ transform: 'rotate(180deg)', opacity: 0 })),
  transition('in => out', animate('300ms ease-in-out')),
  transition('out => in', animate('300ms ease-in-out'))
]);

export const bounceInOut = trigger('bounceInOut', [
  state('in', style({ transform: 'scale(1)', opacity: 1 })),
  state('out', style({ transform: 'scale(0)', opacity: 0 })),
  transition('in => out', animate('200ms ease-in')),
  transition('out => in', animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'))
]);

export const shake = trigger('shake', [
  state('normal', style({ transform: 'translateX(0)' })),
  state('shake', style({ transform: 'translateX(0)' })),
  transition('normal => shake', animate('500ms ease-in-out', keyframes([
    style({ transform: 'translateX(-10px)', offset: 0.1 }),
    style({ transform: 'translateX(10px)', offset: 0.2 }),
    style({ transform: 'translateX(-10px)', offset: 0.3 }),
    style({ transform: 'translateX(10px)', offset: 0.4 }),
    style({ transform: 'translateX(-10px)', offset: 0.5 }),
    style({ transform: 'translateX(10px)', offset: 0.6 }),
    style({ transform: 'translateX(-10px)', offset: 0.7 }),
    style({ transform: 'translateX(10px)', offset: 0.8 }),
    style({ transform: 'translateX(-10px)', offset: 0.9 }),
    style({ transform: 'translateX(0)', offset: 1.0 })
  ])))
]);

export const pulse = trigger('pulse', [
  state('normal', style({ transform: 'scale(1)' })),
  state('pulse', style({ transform: 'scale(1)' })),
  transition('normal => pulse', animate('1000ms ease-in-out', keyframes([
    style({ transform: 'scale(1)', offset: 0 }),
    style({ transform: 'scale(1.05)', offset: 0.5 }),
    style({ transform: 'scale(1)', offset: 1.0 })
  ])))
]);

export const flash = trigger('flash', [
  state('normal', style({ opacity: 1 })),
  state('flash', style({ opacity: 1 })),
  transition('normal => flash', animate('1000ms ease-in-out', keyframes([
    style({ opacity: 1, offset: 0 }),
    style({ opacity: 0, offset: 0.25 }),
    style({ opacity: 1, offset: 0.5 }),
    style({ opacity: 0, offset: 0.75 }),
    style({ opacity: 1, offset: 1.0 })
  ])))
]);

export const slideInFromLeft = trigger('slideInFromLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
  ])
]);

export const slideInFromRight = trigger('slideInFromRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);

export const slideInFromTop = trigger('slideInFromTop', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
  ])
]);

export const slideInFromBottom = trigger('slideInFromBottom', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
  ])
]);

export const zoomIn = trigger('zoomIn', [
  transition(':enter', [
    style({ transform: 'scale(0)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'scale(0)', opacity: 0 }))
  ])
]);

export const zoomOut = trigger('zoomOut', [
  transition(':enter', [
    style({ transform: 'scale(1.2)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'scale(1.2)', opacity: 0 }))
  ])
]);

export const rotateIn = trigger('rotateIn', [
  transition(':enter', [
    style({ transform: 'rotate(-180deg)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'rotate(0deg)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'rotate(180deg)', opacity: 0 }))
  ])
]);

export const flipIn = trigger('flipIn', [
  transition(':enter', [
    style({ transform: 'rotateY(-90deg)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'rotateY(0deg)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('400ms ease-in', style({ transform: 'rotateY(90deg)', opacity: 0 }))
  ])
]);

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ transform: 'translateY(30px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(-30px)', opacity: 0 }))
  ])
]);

export const fadeInDown = trigger('fadeInDown', [
  transition(':enter', [
    style({ transform: 'translateY(-30px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(30px)', opacity: 0 }))
  ])
]);

export const fadeInLeft = trigger('fadeInLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-30px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(30px)', opacity: 0 }))
  ])
]);

export const fadeInRight = trigger('fadeInRight', [
  transition(':enter', [
    style({ transform: 'translateX(30px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(-30px)', opacity: 0 }))
  ])
]);

export const staggerIn = trigger('staggerIn', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ])
]);

export const staggerOut = trigger('staggerOut', [
  transition(':leave', [
    query(':leave', [
      stagger(50, [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ])
]);

export const expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({ height: '0px', overflow: 'hidden' })),
  state('expanded', style({ height: '*', overflow: 'hidden' })),
  transition('collapsed => expanded', [
    animate('300ms ease-out')
  ]),
  transition('expanded => collapsed', [
    animate('300ms ease-in')
  ])
]);

export const widthExpand = trigger('widthExpand', [
  state('collapsed', style({ width: '0px', overflow: 'hidden' })),
  state('expanded', style({ width: '*', overflow: 'hidden' })),
  transition('collapsed => expanded', [
    animate('300ms ease-out')
  ]),
  transition('expanded => collapsed', [
    animate('300ms ease-in')
  ])
]);

export const heightExpand = trigger('heightExpand', [
  state('collapsed', style({ height: '0px', overflow: 'hidden' })),
  state('expanded', style({ height: '*', overflow: 'hidden' })),
  transition('collapsed => expanded', [
    animate('300ms ease-out')
  ]),
  transition('expanded => collapsed', [
    animate('300ms ease-in')
  ])
]);

export const slideToggle = trigger('slideToggle', [
  state('hidden', style({ height: '0px', overflow: 'hidden' })),
  state('visible', style({ height: '*', overflow: 'hidden' })),
  transition('hidden => visible', [
    animate('300ms ease-out')
  ]),
  transition('visible => hidden', [
    animate('300ms ease-in')
  ])
]);

export const loadingSpinner = trigger('loadingSpinner', [
  state('loading', style({ transform: 'rotate(0deg)' })),
  state('loaded', style({ transform: 'rotate(360deg)' })),
  transition('loading => loaded', [
    animate('1000ms linear')
  ])
]);

export const progressBar = trigger('progressBar', [
  state('start', style({ width: '0%' })),
  state('end', style({ width: '100%' })),
  transition('start => end', [
    animate('2000ms ease-out')
  ])
]);

export const typewriter = trigger('typewriter', [
  transition(':enter', [
    style({ width: '0' }),
    animate('2000ms ease-out', style({ width: '*' }))
  ])
]);

export const heartbeat = trigger('heartbeat', [
  state('normal', style({ transform: 'scale(1)' })),
  state('beat', style({ transform: 'scale(1)' })),
  transition('normal => beat', [
    animate('600ms ease-in-out', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.1)', offset: 0.14 }),
      style({ transform: 'scale(1)', offset: 0.28 }),
      style({ transform: 'scale(1.1)', offset: 0.42 }),
      style({ transform: 'scale(1)', offset: 1.0 })
    ]))
  ])
]);

export const wobble = trigger('wobble', [
  state('normal', style({ transform: 'translateX(0)' })),
  state('wobble', style({ transform: 'translateX(0)' })),
  transition('normal => wobble', [
    animate('1000ms ease-in-out', keyframes([
      style({ transform: 'translateX(0)', offset: 0 }),
      style({ transform: 'translateX(-25%)', offset: 0.15 }),
      style({ transform: 'translateX(20%)', offset: 0.30 }),
      style({ transform: 'translateX(-15%)', offset: 0.45 }),
      style({ transform: 'translateX(10%)', offset: 0.60 }),
      style({ transform: 'translateX(-5%)', offset: 0.75 }),
      style({ transform: 'translateX(0)', offset: 1.0 })
    ]))
  ])
]);

export const jello = trigger('jello', [
  state('normal', style({ transform: 'skew(0deg, 0deg)' })),
  state('jello', style({ transform: 'skew(0deg, 0deg)' })),
  transition('normal => jello', [
    animate('1000ms ease-in-out', keyframes([
      style({ transform: 'skew(0deg, 0deg)', offset: 0 }),
      style({ transform: 'skew(-12.5deg, 0deg)', offset: 0.111 }),
      style({ transform: 'skew(6.25deg, 0deg)', offset: 0.222 }),
      style({ transform: 'skew(-3.125deg, 0deg)', offset: 0.333 }),
      style({ transform: 'skew(1.5625deg, 0deg)', offset: 0.444 }),
      style({ transform: 'skew(-0.78125deg, 0deg)', offset: 0.555 }),
      style({ transform: 'skew(0.390625deg, 0deg)', offset: 0.666 }),
      style({ transform: 'skew(-0.1953125deg, 0deg)', offset: 0.777 }),
      style({ transform: 'skew(0deg, 0deg)', offset: 1.0 })
    ]))
  ])
]);



