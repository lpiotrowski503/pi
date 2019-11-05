# Notatki

> ## CLI

### run program

```bash
tns create <NAME-PROJECT>
tns run android --bundle
tns debug android --bundle
```

```bash
# command to create icons
tns resources generate icons <PATH_TO_ICON>
```

```bash
# command to create welcome screen
tns resources generate splashes <PATH_TO_ICON> --bachground [ white | 0xfff ]
```

---

> ## LAYOUT

### StackLayout

```html
<!-- orientation - vertical, horizontal -->
<!-- horizontalAligment - center, top, bottom, right, left, stretch -->
<!-- verticalAligment - center, top, bottom, right, left, stretch -->
<StackLayout></StackLayout>
```

### FlexboxLayout

```html
<!-- flexDirection - row, column -->
<!-- alignSelf - custom flex element -->
<FlexboxLayout></FlexboxLayout>
```

### GridLayout

```html
<!-- auto - bigest space  -->
<!-- * - if comething inside  -->
<!-- colSpan - how many columns  -->
<!-- rowSpan - how many rows  -->
<GridLayout rows="auto, *, 70, 2*" columns="*, auto, 100">
  <label row="0" column="0" colSpan="2">item 1</label>
  <label row="2" column="1">item 2</label>
  <label row="3" column="2">item 3</label>
</GridLayout>
```

### AbsoluteLayout

```html
<AbsoluteLayout>
  <label top="130" left="90">item 1</label>
  <label>item 2</label>
  <label>item 3</label>
</AbsoluteLayout>
```

---

> ## FORM

### Text display

```html
<!-- label = h1 ... h6, p -->
<label text="Take a walk every day"></label>
```

### Input

```html
<!-- TextField = input, hint = placeholder -->
<TextField hint="Challenge title"></TextField>
```

### Button

```html
<!-- Button = button, tap = click -->
<button text="Dupa" (tap)="onTap()"></button>
```

---

> ## SCROLL

```html
<ScrollView>
  <label text="Take a walk every day"></label>
</ScrollView>
```

---

> ## LIST ( loop )

```html
<!-- iosEstematedRowHeight="65" - for ios issiue -->
<ListView [items]="items" iosEstematedRowHeight="65">
  <label text="Take a walk every day"></label>
</ListView>
```

---

> ## TAP

```ts
public onTap(args: ItemEventData): void {}
```

---

> ## ROUTING

```html
<page-router-outlet></page-router-outlet>
```

```html
<button nsRouterLink="/path" [clearHistory]="true"></button>
```

```ts
// component
constructor(
  private router: RouterExtensions,
  private activatedRoute: ActivatedRoute,
  private pageRoute: PageRoute,
  )

public onRouter(): void {
  // destroy all pages
  this.router.navigate(['/today'], { clearHistory: true })
  this.page.actionBarHidden = true
}

ngOnInit() {
  // this.activatedRoute.paramMap.subscribe(paramMap => {
    // console.log(paramMap.get('mode'))
  // })
  this.pageRoute.activatedRoute.subscribe(activatedRoute => {
    activatedRoute.paramMap.subscribe(paramMap => {
      console.log(paramMap.get('node'))
    })
  })
}
```

```ts
// module
// nessesary
@NgModule({
  imports: [NativeScriptRouterModule]
})
```

```ts
// routing module
{
  path: 'challenges',
  component: ChallengeTabsComponent,
  children: [
    {
      path: 'today',
      component: TodayComponent,
      outlet: 'today'
    },
    {
      path: 'current-challenge',
      component: TodayComponent,
      outlet: 'currentChallenge'
    }
  ]
}
{
  path: :':mode'
  component: ChallengeEditComponent
}
```

---

> ## ACTIONBAR

```html
<ActionBar title="App title" (loaded)="setButton()">
  <!-- <NavigationButton text="Go back" android.systemIcon="ic_menu_back"><NavigationButton> -->
  <NavigationButton icon="res://menu_black"><NavigationButton>
  <ActionItem ios.position="left">
    <Label text="MENU"></Label>
  </ActionItem>
</ActionBar>
```

---

> ## ONLY ONE PLATFORM

```ts
import { isAndroid } from 'platform';

declare var android: any

// access to page
constructor(private page: Page)

public setButton(): void {
  if (isAndroid) {
    const androidToolbar = this.page.actionBar.nativeView
    const backButton = androidToolbar.getNavigationIcon()
    if (backButton) {
      backButton.setColorFilter(android.graohics.Color.parseColor('#171717'), (<any>andoid.graphics).PorterDuff.Mode.SRC_ATOP)
    }
  }
}
```

---

> ## TRANSITION

```html
<button
  nsRouterLink="/path"
  [clearHistory]="true"
  pageTransition="slideLeft"
></button>
```

```ts
public onRouter(): void {
  // destroy all pages
  this.router.navigate(['/today'], { transition: { name: 'slideLeft' } })
}
```

---

> ## TABVIEW

```html
<TabView
  androidTabsPosition="bottom"
  androidSelectedTabHighlightColor="#7c015d"
  selectedTabTextColor="7c015d"
  >
  <page-router-outlet *tabItem="{ title: 'Today' }" name="today"><page-router-outlet>
  <page-router-outlet *tabItem="{ title: 'Current Challenge' }" name="currentChallenge"></page-router-outlet>
</TabView>
```

---

> ## SIDEDRAWER

```bash
tns plugin add nativescript-ui-sidedrawer
```

```html
<TabView
  androidTabsPosition="bottom"
  androidSelectedTabHighlightColor="#7c015d"
  selectedTabTextColor="7c015d"
  >
  <page-router-outlet *tabItem="{ title: 'Today' }" name="today"><page-router-outlet>
  <page-router-outlet *tabItem="{ title: 'Current Challenge' }" name="currentChallenge"></page-router-outlet>
</TabView>
```

```html
<RadSideDrawer>
  <StackLayout tkDrawerContent>
    <button ios:text="Logout" android:text="Logout" class="btn"></button>
  </StackLayout>
  <StackLayout thMainContent>
    <page-router-outlet></page-router-outlet>
  </StackLayout>
</RadSideDrawer>
```

> ## MODAL

```ts
constructor(
  private modalDialog: ModalDialogService
  private vcRef: ViewContainerData
  ) {}

onChangeStatus() {
  this.modalDialog.showModal(DayModalComponent, {
    fullscreen: true,
    viewContainerRef: this.vcRef
  })
}

Module {
  entryComponents: [DayModalComponent]
}
```

---

> ## STYLE

### difrends platform

- app.common.css
- app.android.css
- app.ios.css

```css
.fa {
  font-family: 'FontAwesome', Font-Awesome';
}
```

```html
<Label text="&#xf0fe" class="fa"></Label>
```

---

> ## INTERFACE ENUM

```ts
export enum DayStatus {
  Open,
  Completed,
  Failed
}

export interface IDay {
  dayInMonth: number;
  status: DayStatus;
}
```

---

> ## SPINNER

```xml
<ActivityIdicator [busy]="isLoading"></ActivityIdicator>
```

---

> ## LOCALSTORAGE

```ts
import {
  setString,
  getString,
  remove,
  hasKey
} from 'tns-core-modules/application-settings';
// set data to local storage
setString('userData', JSON.stringify(user));

// remove from local storage
remove('userData');

// return true if userData is in locale storage
hasKey('userData');

// get dataUser from local storage
JSON.parse(getString('userData'));
```

---

> ## WEB MOBILE APP IN ONE PROJECT

```bash
# install angular cli
npm i -g @angular/cli
# install schematic
npm i -g @nativescript/schematics
```

> ## NOTES

```ts
// conver string to boolean
const variable = '';
variable = !!variable;

// return observable of value false
return of(false);

// rxjs
// automatic unsubscribe after 1 response
take(1);

// return observable
switchMap(() => {});

// list of observables
flatMap(
  () => {}
  () => {}
  () => {}
  () => {}
)

// ?
tap()
```
