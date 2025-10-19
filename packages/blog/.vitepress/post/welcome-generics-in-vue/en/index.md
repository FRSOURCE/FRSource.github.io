---
description: "Vue 3.3 has been just released \U0001F49A And alongside other features and improvements, it includes a new compiler feature that I have been eagerly waiting on - generics support!"
head:
    - - meta
      - name: keywords
        content: 'tutorial, Vue, generics, typescript, type-safety'
image:
    src: /post/welcome-generics-in-vue/splash.webp
    alt: 'Vue logo with "Generics" text on blurry, brownish, rain-style background'
author: frs
syncDateMedium: 1684126658000
syncedIdMedium: 1c01cc3da0fa
syncedUrlMedium: 'https://medium.com/@kubafreisler/welcome-generics-in-vue-1c01cc3da0fa'
---

# Welcome generics in Vue

Vue 3.3 has been just released 💚 And alongside other features and improvements, it includes a new compiler feature that I have been eagerly waiting on - [**generics support**](https://vuejs.org/api/sfc-script-setup.html#generics)! This feature brings a new level of flexibility and reusability to Vue.js components as it allows us to create **dynamically typed component slots or emits**.

## Generics in TypeScript

TypeScript's (TS) static typing can help detect errors early in the development process. Developers can use TypeScript's various tools to express the APIs of their components, composables, services, and other code elements. Generics are a crucial TypeScript feature and allow defining types or functions that can work with various data types without compromising type safety.

### Generics in action - array function filterEven

Let's consider a simple example of a `filterEven` function that takes an array as input and returns a new array with odd-indexed items filtered out:

```ts
export const filterEven = (array: unknown[]) =>
    array.filter((_, index) => index % 2);
```

Although this function works in simple cases, it has a significant flaw: the returned array loses its original type and is outputted with the type `unknown[]` instead:

![The array returned by "filterEven" function is typed as "unknown[]"](/post/welcome-generics-in-vue/example1-issue.webp)
[See it in the playground](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgSwDZQKYCcCiA3VYYC8MAFAIbrqkCeAXDAK5gDWYIA7mANoC6AlIQD4Y5SlQB0iFBmLEA+gBoYCMABNUAD34EhytepgBSGACZeAbgBQF0JFgBbKgEEK1OgG8YNtGCh1o6ZQBzGABfHkIYTg8vPF8YAHIIEDtUKAALIPjQxWjwbzj40jAqdMzQ7ksrG2h4ZDR0VBVnUQjJepw8Ygdm6nMLIA).

From TypeScript's perspective, this behavior is expected because the input is described as type `unknown[]` in the `filterEven` function declaration. Since the function's purpose is to take in an array and return a filtered version of it, TS assumes that the array type won't change in the process.

However, this is not exactly how we wanted our function to behave. We don't want it to always return `unknown[]` - it should return the same type of array that was passed in. To achieve this, we can use generics.

Instead of explicitly specifying the input array type as `unknown[]`, we can declare it to be of any type that extends (is built upon) `unknown[]`.

```ts
export const filterEven = <Array extends unknown[]>(array: Array) =>
    array.filter((_, index) => index % 2);
```

This approach allows TypeScript to infer the type of the input array into the generic `Array` and then apply it to the output array:

![The array returned by "filterEven" function is typed with the same type as the input array](/post/welcome-generics-in-vue/example3-output.webp)
[See it in the playground](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgSwDZQKYCcCiA3VYYC8MAPAILroCGAnjKgB5pgAmEMArmANZggDuYANoBdAHwAKShRoAuGOSrUAlIVEwpigHSIUGceID6AGhgIWDFQTVnmDGAFIYAJiUBuAFDvQkWAFtqCrIwAN4w3kxQctDoZgDmMAC+IoQwgqHheJEwAOQQIL6oUAAWcdmJJungEXLZlGDUxaWJwh6ent7Q8Mho6KjMgbREOj04eOL+A27uQA).

Voila, now the array returned by `filterEven` function has the correct type! 🎉

> Still don't understand how generics work in TypeScript? Don't worry! You might want to read further about them in [the official handbook](https://www.typescriptlang.org/docs/handbook/2/generics.html).

## Generics syntax in Vue Single-File Components (SFCs)

Now you understand how generics might be useful in TypeScript (or any other statically typed language), but what about Vue? Let's write a component example where generics might come in handy.

Imagine a `Tabs` component that:

- will handle the tab navigation by itself,
- will support complete customization of the rendered content for each tab via slots.

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

This component can be consumed as follows:

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

[Click here to see a working demo](https://play.vuejs.org/#eNqNVEtu20AMvQqrTRzAloIsFSdIu2m7ahfZWVnIEhVPLM0MZiglhqCzdNkT9F49Qkl9HAkFghiwoeGQj4+PT26Dz9aGTY1BHGx95pQlKFP9dJsE5JMAPFJt7xINoCprHMFDuvdQOFNBEoSRnKQ6CW4kR76Z0Z7AOpPXGfXZt7CTC4AWVB5z3R49eSxLdNxiDQdMc6Wf5ObL8oaxCDXJzcMBQeo2cs3ZkDpSWYkelAZTO/BkHH6SqrG3j2HXgk4rlPqvLj2Bf8GU0PFc3SN06yUrUxT/E/pxDs64fEOH3B/Bm2pgBUMxUKpKppHDc81BMnASaqU6CuO/v37/eYcfooaHjT8oR3OCj6zsNhpWw4vgA2FlS56jX8uWxTiCw5I35unEghwQBeDgsODYgcj6OIqyXIfPPsdSNS7USJG2VfQiaoSZ9/fXkanp7cz10QBfpUr3T/zcbzMm/mXg2YY5u9n40hCHW9ZgD10SjEWsbx8KR/2g60a03jxDk2jsso1mswXrYLLXR83ZshCFrKqyNfEWusGpFwxxwTIu7GnFmDkWSuNPOW3bgZeMF4+m8OR4cTdvhpgCZzNMgW4newLo7laXi05pRqrB7zrHV+7H9FZXkrC85jn5cqK9Wl3C7d3AMRQ6uxlI2KRljY+C8Z4rctVMW9vXRKZnJJ9mUxjHAq7aaao1j8peA3Upr5L0S4IpOz7iiZNV/haik0UOjajn8H1WquzIF8uB1ZQxt8PYmK0w/GWIAwa8ibNHRjEasjL1YrZR75mrtuK33oznnqzi2bcCOYKMFhsUWTiMj/0rw49ne7ILEqpS96T0hoyN4frKvrLY7FpGHLOD7h9KGb8T).

In this example, we pass an array `productTabs` into the `Tabs` component as a prop. The component then displays tab navigation buttons and allows the consumer to provide a tab template through a slot. [This slot is scoped](https://vuejs.org/guide/components/slots.html#scoped-slots) as the data `tab` (containing information about the currently active tab) is passed into it.

It seems like everything has worked on the first try, but has it really? Let's take a closer look at the type of the `tab` property that's passed into a slot template:

![Tab property available in slot has a type of "{ id: string; heading: string; content: string }"](/post/welcome-generics-in-vue/vue-example1-type-output.webp)

Did you notice anything missing? The issue here is similar to the one previously encountered in this article. The type of `tab` property has been narrowed down to the type of the `tabs` prop. However, in our case, the input type is broader than that as the `products` field is being stripped down.

Okay, so how to fix it? The solution, of course, involves the use of generics! Instead of typing `tabs` prop strictly like we did in previous example we should allow TypeScript to accept and infer specific type that fulfills the type `{ id: string; heading: string; content: string; }`:

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

Let's examine the implementation. First, we created a generic by adding `generic="Tab extends { id: string; heading: string; content: string; }"` to the component `<script>` section. Second, we used the `Tab` generic to declare the type of `tabs` prop as `Tab[]`. By making these two changes, we informed TypeScript that the `tabs` prop can be filled with any type, as long as it's an array, and each item is built on top of type `{ id: string; heading: string; content: string; }`.

And what about the consumer component? Is the slot type inferred correctly now? Let's take a look:

![Tab property available in slot has a type of "{ id: string; heading: string; content: string; products: { name: string }[] }"](/post/welcome-generics-in-vue/vue-example2-output.webp)

Excellent! The tab data is passed directly into the scoped slot with the correct, initial type! 🎉 This enhances the flexibility of our component, as the slot content can now easily use custom tab properties without sacrificing the benefits of static type checking.

## Closing words

Generics support was a huge addition to Vue.js and its arrival is a significant milestone. The introduction of this feature simplified the process of representing dynamic types that are essential for achieving the required flexibility in specific scenarios. Also, the `generic=""` attribute is a seamless and natural addition to Vue SFC syntax, which enhances the language's expressiveness. I hope to see more and more libraries (particularly UI ones) taking advantage of generics and improving their type safety!
