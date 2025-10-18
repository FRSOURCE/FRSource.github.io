---
description: Vue 3.3 został właśnie opublikowany 💚 Poza innymi usprawnieniami, znajdziemy w nim nową funkcjonalność kompilatora na którą bardzo czekałem - wsparcie dla generyków w komponentach!
head:
    - - meta
      - name: keywords
        content: poradnik, tutorial, Vue, generyki, typescript, typy
image:
    src: /post/welcome-generics-in-vue/splash.webp
    alt: Logo Vue z napisem "Generics" na rozmytym, brązowanym tle pokrytym kroplami deszczu
author: frs
---

# Powitajmy generyki w Vue

Vue 3.3 został właśnie opublikowany 💚 Poza innymi usprawnieniami, znajdziemy w nim nową funkcjonalność kompilatora na którą bardzo czekałem - wsparcie dla [**generyków w komponentach**](https://vuejs.org/api/sfc-script-setup.html#generics)! Typy generyczne pozwalają na zbudowanie znacznie bardziej elastycznych i reużywalnych komponentów poprzez umożliwienie definiowania **dynamicznych typów do slotów i event emitterów**.

## Generyki w TypeSscript

Statyczne typowanie w TypeScipt (TS) pozwala odkryć błędy na wcześniejszych etapach wytwarzania kodu. Deweloperzy mogą używać wielu narzędzi dostarczanych przez TypeScript by wyrazić interfejsy swoich komponentów, komposabli, serwisów i innych części składowych aplikacji. Generyki są kluczową funkcjonalnością TypeScript i pozwalają na definiowanie typów lub funkcji, które mogą poprawnie wspierać zróżnicowane typy danych bez poświęcania type safety.

### Generyki w akcji - funkcja tablicowa filterEven

Zastanówmy się nad prostym przykładem funkcji `filterEven`, które jako wejście przyjmuje tablicę i zwracą nową tablicę z odfiltrowanymi elementami o nieparzystych indeksach:

```ts
export const filterEven = (array: unknown[]) =>
    array.filter((_, index) => index % 2);
```

Mimo tego, iż ta funkcja działa w prostych przypadkach zawiera ona znaczący błąd: zwracana tablica traci oryginalny typ na rzecz `unknown[]`:

![Tablica zwracana przez funkcję "filterEven" jest otypowana jako "unknown[]"](/post/welcome-generics-in-vue/example1-issue.webp)
[Zobacz w środowisku online](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgSwDZQKYCcCiA3VYYC8MAFAIbrqkCeAXDAK5gDWYIA7mANoC6AlIQD4Y5SlQB0iFBmLEA+gBoYCMABNUAD34EhytepgBSGACZeAbgBQF0JFgBbKgEEK1OgG8YNtGCh1o6ZQBzGABfHkIYTg8vPF8YAHIIEDtUKAALIPjQxWjwbzj40jAqdMzQ7ksrG2h4ZDR0VBVnUQjJepw8Ygdm6nMLIA).

Takie zachowanie jest oczekiwane patrząc z perspektywy TypeScripta, ponieważ w deklaracji funkcji `filterEven` argument wejściowy opisany jest typem `unknown[]`. Celem tej funkcji jest przyjęcie tablicy wejściowej i zwrócenie jej odfiltrowanej wersji. Patrząc z tej perspektywy TS poprawnie zakłada, że typ tablicy nie zmieni się w trakcie wykonywania funkcji `filterEven`.

Niestety, my nie chcemy, by funkcja zachowywała się w ten sposób. Nie za każdym razem powinna być zwracana tablica o typie `unknown[]` - typ zwracany powinien być zawsze taki sam jak typ tablicy wejściowej. Aby osiągnąć ten cel, powinniśmy użyć generyków.

Zamiast bezpośrednio określać typ argumentu wejściowego jako `unknown[]` możemy zdeklarować go jako jakikolwiek typ, który rozszerza (tzn. jest zbudowany mając jako podstawę) `unknown[]`:

```ts
export const filterEven = <Array extends unknown[]>(array: Array) =>
    array.filter((_, index) => index % 2);
```

Dzięki takiemu podejściu TypeScript ma szanse na inferencję typu tablicy wejściowej i przypisanie go do generyka `Array`. Następnie, typ zapisany w generyku użyty zostaje do otypowania tablicy wyjściowej:

![Tablica zwracana przez funckje "filterEven" jest już otypowana dokładnie takim samym typem jak tablica wejściowa](/post/welcome-generics-in-vue/example3-output.webp)
[Zobacz to w środowisku online](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgSwDZQKYCcCiA3VYYC8MAPAILroCGAnjKgB5pgAmEMArmANZggDuYANoBdAHwAKShRoAuGOSrUAlIVEwpigHSIUGceID6AGhgIWDFQTVnmDGAFIYAJiUBuAFDvQkWAFtqCrIwAN4w3kxQctDoZgDmMAC+IoQwgqHheJEwAOQQIL6oUAAWcdmJJungEXLZlGDUxaWJwh6ent7Q8Mho6KjMgbREOj04eOL+A27uQA).

Voila, teraz wszystko działa jak chcieliśmy - tablica zwracana przez funkcję `filterEven` ma odpowiedni typ! 🎉

> Jeśli dalej nie rozumiesz jak działają generyki nie poddawaj się! Spojrzenie na [oficjalny poradnik](https://www.typescriptlang.org/docs/handbook/2/generics.html) opisujący ten temat może Ci pomóc.

## Składnia generyków w Vue Single-File Components (SFC)

Teraz rozumiesz zasadę działania typów generycznych w TypeScript (i innych statycznie typowanych językach), ale jak się to ma do Vue? Spróbujmy napisać przykładowy komponent w którym będzimy mogli wykorzystać generyki.

Wyobraźmy sobie komponent `Tabs`, który:

- sam zarządza nawigacją pomiędzy zakładkami,
- wspiera dowolne rozszerzanie renderowania treści zakładek w opaciu o sloty.

```vue
// Tabs.vue
<script lang="ts" setup>
import { ref, computed } from 'vue';

const props = defineProps<{
    tabs: { id: string; heading: string; content: string }[];
}>();

const activeIndex = ref(0);
const activeTab = computed(() => props.tabs[activeIndex.value]);
</script>

<template>
    <div>
        <button
            v-for="({ heading, id }, i) in tabs"
            :key="id"
            type="button"
            @click="activeIndex = i"
        >
            {{ heading }}
        </button>
        <section class="content">
            <slot :tab="activeTab" />
        </section>
    </div>
</template>
```

Tak zdefiniowany komponent może zostać łatwo skonsumowany:

```vue
// App.vue
<script lang="ts" setup>
import Tabs from './Tabs.vue';

const productTabs = [
    {
        id: 'bestsellers',
        heading: 'Bestsellers',
        content: 'The best-selling articles in our store!',
        products: [{ name: 'Gray sweater' }],
    },
    {
        id: 'offers',
        heading: 'Offers',
        content: 'Here are some best offers tailored just to your liking 🧵',
        products: [{ name: 'Green T-shirt' }],
    },
];
</script>

<template>
    <Tabs :tabs="productTabs" v-slot="{ tab }">
        {{ tab.content }}
    </Tabs>
</template>
```

[Kliknij tutaj, by ujrzeć działające demo](https://play.vuejs.org/#eNqNVEtu20AMvQqrTRzAloIsFSdIu2m7ahfZWVnIEhVPLM0MZiglhqCzdNkT9F49Qkl9HAkFghiwoeGQj4+PT26Dz9aGTY1BHGx95pQlKFP9dJsE5JMAPFJt7xINoCprHMFDuvdQOFNBEoSRnKQ6CW4kR76Z0Z7AOpPXGfXZt7CTC4AWVB5z3R49eSxLdNxiDQdMc6Wf5ObL8oaxCDXJzcMBQeo2cs3ZkDpSWYkelAZTO/BkHH6SqrG3j2HXgk4rlPqvLj2Bf8GU0PFc3SN06yUrUxT/E/pxDs64fEOH3B/Bm2pgBUMxUKpKppHDc81BMnASaqU6CuO/v37/eYcfooaHjT8oR3OCj6zsNhpWw4vgA2FlS56jX8uWxTiCw5I35unEghwQBeDgsODYgcj6OIqyXIfPPsdSNS7USJG2VfQiaoSZ9/fXkanp7cz10QBfpUr3T/zcbzMm/mXg2YY5u9n40hCHW9ZgD10SjEWsbx8KR/2g60a03jxDk2jsso1mswXrYLLXR83ZshCFrKqyNfEWusGpFwxxwTIu7GnFmDkWSuNPOW3bgZeMF4+m8OR4cTdvhpgCZzNMgW4newLo7laXi05pRqrB7zrHV+7H9FZXkrC85jn5cqK9Wl3C7d3AMRQ6uxlI2KRljY+C8Z4rctVMW9vXRKZnJJ9mUxjHAq7aaao1j8peA3Upr5L0S4IpOz7iiZNV/haik0UOjajn8H1WquzIF8uB1ZQxt8PYmK0w/GWIAwa8ibNHRjEasjL1YrZR75mrtuK33oznnqzi2bcCOYKMFhsUWTiMj/0rw49ne7ILEqpS96T0hoyN4frKvrLY7FpGHLOD7h9KGb8T).

W tym przykładzie przekazujemy tablicę `productTabs` do komponentu `Tabs` jako prop. Komponent następnie wyświetla przyciski nawigacyjne zakładek i pozwala konsumentowi na podanie dowolnego szablonu treści poprzez slot. Jest to [scoped slot](https://vuejs.org/guide/components/slots.html#scoped-slots) w którym przekazywany jest argument `tab` zawierający informacje na temat aktualnie aktywnej zakładki.

Wygląda na to, że wszystko zadziałało za pierwszym razem! Ale czy na pewno? Przyjrzyjmy się bliżej typowi argumentu `tab`, który jest przekazywany do slotu:

![Argument tab dostępny w slocie ma typ "{ id: string; heading: string; content: string }"](/post/welcome-generics-in-vue/vue-example1-type-output.webp)

Czy udało Ci się coś znaleźć? Problem z którym borykamy się teraz jest podobny do tego opisywanego już wcześniej w tym artykule. Typ zmiennej `tab` został zawężony do typu propa `tabs`. Jednak w naszym przypadku wiemy, że typ wejściowy jest szerszy - zawiera on przecież pole `products` do którego nie mamy teraz dostępu z poziomu slotu. Pora to zmienić.

Jak można było się domyśleć - proponowanym rozwiązaniem będą generyki! Zamiast typować prop `tabs` jako `{ id: string; heading: string; content: string; }` powinniśmy pozwolić TypeScriptowi na zaakceptowanie i inferencję dowolnego typu, który spełnia typ `{ id: string; heading: string; content: string; }`:

```vue
// Tabs.vue
<script
    lang="ts"
    setup
    generic="Tab extends { id: string; heading: string; content: string }"
>
import { ref, computed } from 'vue';

const props = defineProps<{
    tabs: Tab[];
}>();

const activeIndex = ref(0);
const activeTab = computed(() => props.tabs[activeIndex.value]);
</script>

<template>
    <div>
        <button
            v-for="({ heading, id }, i) in tabs"
            :key="id"
            type="button"
            @click="activeIndex = i"
        >
            {{ heading }}
        </button>
        <section class="content">
            <slot :tab="activeTab" />
        </section>
    </div>
</template>
```

Przyjrzyjmy się tej implementacji. Po pierwsze, stworzyliśmy generyka dodając `generic="Tab extends { id: string; heading: string; content: string; }"` do sekcji `<script>` komponentu. Po drugie, użyliśmy generyka `Tab` do zadeklarowania propa `tabs` jako `Tab[]`. Dokonując tych dwóch zmian poinformowaliśmy kompilator TypeScript, że prop `tabs` może być uzupełniony dowolnym typem - tak długo jak jest on tablicą i rozszerza typ `{ id: string; heading: string; content: string; }`.

A co z naszym komponentem-konsumentem? Czy typ danych przesyłanych do slotu jest już inferowany poprawnie? Zobaczmy:

![Zmienna tab dostępna w slocie ma typ "{ id: string; heading: string; content: string; products: { name: string }[] }"](/post/welcome-generics-in-vue/vue-example2-output.webp)

Wspaniale! Zmienna tab przesyłana jest teraz do slotu z odpowiednim typem budowanym na podstawie typu tablicy wejściowej! 🎉 To poprawia możliwości i elastyczność naszego komponentu - treść slotu może teraz używać dowolnych, unikalnych pól wypływających z typu propa `tabs`. To wszystko bez straty benefitów dokładnej, statycznej analizy typów.

## Konkluzja

Wsparcie dla generyków jest dużym dodatkiem do Vue.js i jego nadejście odbije się echem po ekosystemie tego frameworka. Wejście tej funkcjonalności umożliwiło reprezentację dynamicznych typów, które są niezbędne dla uzyskania niezbędnej elastyczności w niektórych przypadkach. Dodatkowo zapis `generic=""` wydaje się być dobrym wyborem - wygląda bardzo naturalnie na tle reszty składni Vue SFC. Mam nadzieję zobaczyć użycie generyków w wielu bibliotekach Vue (szczególnie tych skupionych na dostarczaniu komponentów UI), co w widoczny sposób powinno poprawić ich type safety!
