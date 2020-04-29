import './contentscript.scss';
import { Carrier } from '../common/types';
import { validUsps } from '../common/util';
import { identity, pipe, concat, map, prop, join, flip, match, objOf, tap, filter, uniq } from 'ramda';

const carriers: Carrier[] = [
  {
    name: 'USPS',
    patterns: [
      '(94|93|92|94|95)[0-9]{20}',
      '(94|93|92|94|95)[0-9]{22}',
      '(70|14|23|03)[0-9]{14}',
      '(M0|82)[0-9]{8}',
      '([A-Z]{2})[0-9]{9}([A-Z]{2})',
    ],
    validator: validUsps,
  },
  {
    name: 'UPS',
    patterns: [
      '(1Z)[0-9A-Z]{16}',
      '(T)+[0-9A-Z]{10}',
      '[0-9]{9}',
      '[0-9]{26}',
    ],
    validator: identity,
  },
  {
    name: 'FedEx',
    patterns: [
      '[0-9]{20}',
      '[0-9]{15}',
      '[0-9]{12}',
      '[0-9]{22}',
    ],
    validator: identity
  }
];

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => pipe(
//   map(

//     pipe(
//       prop('patterns'),
//       join('\\b)|(\\b'),
//       concat('(\\b'),
//       flip(concat)('\\b)'),
//       (r: string) => new RegExp(r, 'g'),
//       flip(match)(document.body.innerHTML),
//       // objOf('trackingNumbers'),
//       // tap(x => console.log('x', x)),

//     ),

//   ),
//   objOf('foo'),
//   tap(x => console.log('x', x)),
// )(carriers))
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const foo = carriers.map(carrier => ({
    track: pipe(
      prop('patterns'),
      join('\\b)|(\\b'),
      concat('(\\b'),
      flip(concat)('\\b)'),
      (r: string) => new RegExp(r, 'g'),
      flip(match)(document.body.innerHTML),
      uniq,
      filter(carrier.validator),
      // objOf('trackingNumbers'),
      // tap(x => console.log('x', x)),
    )(carrier),
    name: carrier.name,
  })
  );

  console.log('ccc', foo);
}

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     // console.log(sender.tab ?
//     //             "from a content script:" + sender.tab.url :
//     //             "from the extension");
//     // if (request.greeting == "hello")
//     //   sendResponse({farewell: "goodbye"});
//     const found = document.body.innerHTML.match(new RegExp('(\\b' + carriers.usps.patterns.join('\\b)|(\\b') + '\\b)', 'g'));

//     const f = (found || []);

//     console.log('found', (found || []).filter(onlyUnique));

//     // console.log('reg', '(' + usps.patterns.join(')|(') + ')');
//     // console.log('its', document.body.innerHTML);
//   });

//   function onlyUnique(value, index, self) {
//     return self.indexOf(value) === index;
// }