import{_ as s,a as n,b as a,c as e}from"./chunks/vue-example2-output.1210e036.js";import{_ as l,o as p,c as o,O as t}from"./chunks/framework.aaffc6dd.js";const m=JSON.parse('{"title":"Welcome generics in Vue","description":"Vue 3.3 has been just released 💚 And alongside other features and improvements, it includes a new compiler feature that I have been eagerly waiting on - generics support!","frontmatter":{"type":"article","srcPath":"post/welcome-generics-in-vue/en","description":"Vue 3.3 has been just released 💚 And alongside other features and improvements, it includes a new compiler feature that I have been eagerly waiting on - generics support!","head":[["meta",{"name":"keywords","content":"tutorial, Vue, generics, typescript, type-safety"}]],"image":{"src":"/post/welcome-generics-in-vue/splash.webp","alt":"Vue logo with \\"Generics\\" text on blurry, brownish, rain-style background"},"author":"frs"},"headers":[],"relativePath":"post/welcome-generics-in-vue/index.md","filePath":"post/welcome-generics-in-vue/index.md","lastUpdated":1684126658000,"creationDate":1684126658000}'),r={name:"post/welcome-generics-in-vue/index.md"},c=t(`<h1 id="welcome-generics-in-vue" tabindex="-1">Welcome generics in Vue <a class="header-anchor" href="#welcome-generics-in-vue" aria-label="Permalink to &quot;Welcome generics in Vue&quot;">​</a></h1><p>Vue 3.3 has been just released 💚 And alongside other features and improvements, it includes a new compiler feature that I have been eagerly waiting on - <a href="https://vuejs.org/api/sfc-script-setup.html#generics" target="_blank" rel="noreferrer"><strong>generics support</strong></a>! This feature brings a new level of flexibility and reusability to Vue.js components as it allows us to create <strong>dynamically typed component slots or emits</strong>.</p><h2 id="generics-in-typescript" tabindex="-1">Generics in TypeScript <a class="header-anchor" href="#generics-in-typescript" aria-label="Permalink to &quot;Generics in TypeScript&quot;">​</a></h2><p>TypeScript&#39;s (TS) static typing can help detect errors early in the development process. Developers can use TypeScript&#39;s various tools to express the APIs of their components, composables, services, and other code elements. Generics are a crucial TypeScript feature and allow defining types or functions that can work with various data types without compromising type safety.</p><h3 id="generics-in-action-array-function-filtereven" tabindex="-1">Generics in action - array function filterEven <a class="header-anchor" href="#generics-in-action-array-function-filtereven" aria-label="Permalink to &quot;Generics in action - array function filterEven&quot;">​</a></h3><p>Let&#39;s consider a simple example of a <code>filterEven</code> function that takes an array as input and returns a new array with odd-indexed items filtered out:</p><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> filterEven </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">array</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">unknown</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    array</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">filter</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">_</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">index</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> index </span><span style="color:#89DDFF;">%</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>Although this function works in simple cases, it has a significant flaw: the returned array loses its original type and is outputted with the type <code>unknown[]</code> instead:</p><p><img src="`+s+`" alt="The array returned by &quot;filterEven&quot; function is typed as &quot;unknown[]&quot;"><a href="https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgSwDZQKYCcCiA3VYYC8MAFAIbrqkCeAXDAK5gDWYIA7mANoC6AlIQD4Y5SlQB0iFBmLEA+gBoYCMABNUAD34EhytepgBSGACZeAbgBQF0JFgBbKgEEK1OgG8YNtGCh1o6ZQBzGABfHkIYTg8vPF8YAHIIEDtUKAALIPjQxWjwbzj40jAqdMzQ7ksrG2h4ZDR0VBVnUQjJepw8Ygdm6nMLIA" target="_blank" rel="noreferrer">See it in the playground</a>.</p><p>From TypeScript&#39;s perspective, this behavior is expected because the input is described as type <code>unknown[]</code> in the <code>filterEven</code> function declaration. Since the function&#39;s purpose is to take in an array and return a filtered version of it, TS assumes that the array type won&#39;t change in the process.</p><p>However, this is not exactly how we wanted our function to behave. We don&#39;t want it to always return <code>unknown[]</code> - it should return the same type of array that was passed in. To achieve this, we can use generics.</p><p>Instead of explicitly specifying the input array type as <code>unknown[]</code>, we can declare it to be of any type that extends (is built upon) <code>unknown[]</code>.</p><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> filterEven </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Array</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">unknown</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">&gt;(</span><span style="color:#A6ACCD;font-style:italic;">array</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Array</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    array</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">filter</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">_</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">index</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> index </span><span style="color:#89DDFF;">%</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>This approach allows TypeScript to infer the type of the input array into the generic <code>Array</code> and then apply it to the output array:</p><p><img src="`+n+`" alt="The array returned by &quot;filterEven&quot; function is typed with the same type as the input array"><a href="https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgSwDZQKYCcCiA3VYYC8MAPAILroCGAnjKgB5pgAmEMArmANZggDuYANoBdAHwAKShRoAuGOSrUAlIVEwpigHSIUGceID6AGhgIWDFQTVnmDGAFIYAJiUBuAFDvQkWAFtqCrIwAN4w3kxQctDoZgDmMAC+IoQwgqHheJEwAOQQIL6oUAAWcdmJJungEXLZlGDUxaWJwh6ent7Q8Mho6KjMgbREOj04eOL+A27uQA" target="_blank" rel="noreferrer">See it in the playground</a>.</p><p>Voila, now the array returned by <code>filterEven</code> function has the correct type! 🎉</p><blockquote><p>Still don&#39;t understand how generics work in TypeScript? Don&#39;t worry! You might want to read further about them in <a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank" rel="noreferrer">the official handbook</a>.</p></blockquote><h2 id="generics-syntax-in-vue-single-file-components-sfcs" tabindex="-1">Generics syntax in Vue Single-File Components (SFCs) <a class="header-anchor" href="#generics-syntax-in-vue-single-file-components-sfcs" aria-label="Permalink to &quot;Generics syntax in Vue Single-File Components (SFCs)&quot;">​</a></h2><p>Now you understand how generics might be useful in TypeScript (or any other statically typed language), but what about Vue? Let&#39;s write a component example where generics might come in handy.</p><p>Imagine a <code>Tabs</code> component that:</p><ul><li>will handle the tab navigation by itself,</li><li>will support complete customization of the rendered content for each tab via slots.</li></ul><div class="language-vue line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">// Tabs.vue</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">lang</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">setup</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ref</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">computed</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">vue</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> props </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineProps</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">tabs</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">heading</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">content</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}&gt;</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> activeIndex </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ref</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> activeTab </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">computed</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> props</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">tabs[activeIndex</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value])</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">button</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#C792EA;">v-for</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">({ heading, id }, i) in tabs</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#C792EA;">:key</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">id</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#C792EA;">type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">button</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#C792EA;">@click</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">activeIndex = i</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">        &gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">            {{ heading }}</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">button</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">section</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">class</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">content</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">slot</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">:tab</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">activeTab</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">section</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><p>This component can be consumed as follows:</p><div class="language-vue line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">// App.vue</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">lang</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">setup</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> Tabs </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">./Tabs.vue</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> productTabs </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">bestsellers</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">heading</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Bestsellers</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">content</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">The best-selling articles in our store!</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">products</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Gray sweater</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">offers</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">heading</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Offers</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">content</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Here are some best offers tailored just to your liking 🧵</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">products</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Green T-shirt</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">Tabs</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">:tabs</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">productTabs</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-slot</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">{ tab }</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        {{ tab.content }}</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">Tabs</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><p><a href="https://play.vuejs.org/#eNqNVEtu20AMvQqrTRzAloIsFSdIu2m7ahfZWVnIEhVPLM0MZiglhqCzdNkT9F49Qkl9HAkFghiwoeGQj4+PT26Dz9aGTY1BHGx95pQlKFP9dJsE5JMAPFJt7xINoCprHMFDuvdQOFNBEoSRnKQ6CW4kR76Z0Z7AOpPXGfXZt7CTC4AWVB5z3R49eSxLdNxiDQdMc6Wf5ObL8oaxCDXJzcMBQeo2cs3ZkDpSWYkelAZTO/BkHH6SqrG3j2HXgk4rlPqvLj2Bf8GU0PFc3SN06yUrUxT/E/pxDs64fEOH3B/Bm2pgBUMxUKpKppHDc81BMnASaqU6CuO/v37/eYcfooaHjT8oR3OCj6zsNhpWw4vgA2FlS56jX8uWxTiCw5I35unEghwQBeDgsODYgcj6OIqyXIfPPsdSNS7USJG2VfQiaoSZ9/fXkanp7cz10QBfpUr3T/zcbzMm/mXg2YY5u9n40hCHW9ZgD10SjEWsbx8KR/2g60a03jxDk2jsso1mswXrYLLXR83ZshCFrKqyNfEWusGpFwxxwTIu7GnFmDkWSuNPOW3bgZeMF4+m8OR4cTdvhpgCZzNMgW4newLo7laXi05pRqrB7zrHV+7H9FZXkrC85jn5cqK9Wl3C7d3AMRQ6uxlI2KRljY+C8Z4rctVMW9vXRKZnJJ9mUxjHAq7aaao1j8peA3Upr5L0S4IpOz7iiZNV/haik0UOjajn8H1WquzIF8uB1ZQxt8PYmK0w/GWIAwa8ibNHRjEasjL1YrZR75mrtuK33oznnqzi2bcCOYKMFhsUWTiMj/0rw49ne7ILEqpS96T0hoyN4frKvrLY7FpGHLOD7h9KGb8T" target="_blank" rel="noreferrer">Click here to see a working demo</a>.</p><p>In this example, we pass an array <code>productTabs</code> into the <code>Tabs</code> component as a prop. The component then displays tab navigation buttons and allows the consumer to provide a tab template through a slot. <a href="https://vuejs.org/guide/components/slots.html#scoped-slots" target="_blank" rel="noreferrer">This slot is scoped</a> as the data <code>tab</code> - containing information about the currently active tab - is passed into it.</p><p>Looks like everything has worked on the first try! But did it? Let&#39;s inspect the type of the <code>tab</code> property that&#39;s passed into a slot template more closely:</p><p><img src="`+a+`" alt="Tab property available in slot has a type of &quot;{ id: string; heading: string; content: string }&quot;"></p><p>Did you catch anything missing? The issue here is similar to the one previously encountered in this article. The type of <code>tab</code> property has been narrowed down to the type of the <code>tabs</code> prop. However, in our case, the input type is broader than that as the <code>products</code> field is being stripped down. We have to address this.</p><p>You&#39;ve guessed it - the solution involves the use of generics! Instead of typing <code>tabs</code> prop as <code>{ id: string; heading: string; content: string; }</code> we should allow TypeScript to accept and infer any type that fulfills previously specified type:</p><div class="language-vue line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">// Tabs.vue</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">lang</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ts</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">setup</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">generic</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">Tab</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">heading</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">content</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ref</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">computed</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">vue</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> props </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineProps</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">tabs</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Tab</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}&gt;</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> activeIndex </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ref</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> activeTab </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">computed</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> props</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">tabs[activeIndex</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value])</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">button</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#C792EA;">v-for</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">({ heading, id }, i) in tabs</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#C792EA;">:key</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">id</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#C792EA;">type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">button</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#C792EA;">@click</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">activeIndex = i</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">        &gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">            {{ heading }}</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">button</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">section</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">class</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">content</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">slot</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">:tab</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">activeTab</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">section</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div><p>Let&#39;s examine the implementation. First, we created a generic by adding <code>generic=&quot;T extends { id: string; heading: string; content: string; }&quot;</code> to the component <code>&lt;script&gt;</code> section. Second, we used the <code>Tab</code> generic to declare the type of <code>tabs</code> prop as <code>Tab[]</code>. By making these two changes, we informed TypeScript that the <code>tabs</code> prop can be filled with any type, as long as it&#39;s an array, and each item is built on top of type <code>{ id: string; heading: string; content: string; }</code>.</p><p>And what about the consumer component? Is the slot type inferred correctly now? Let&#39;s take a look:</p><p><img src="`+e+'" alt="Tab property available in slot has a type of &quot;{ id: string; heading: string; content: string; products: { name: string }[] }&quot;"></p><p>Excellent! The tab data is passed directly into the scoped slot with the correct, initial type! 🎉 This enhances the flexibility of our component, as the slot content can now easily use custom tab properties without sacrificing the benefits of static type checking.</p><h2 id="closing-words" tabindex="-1">Closing words <a class="header-anchor" href="#closing-words" aria-label="Permalink to &quot;Closing words&quot;">​</a></h2><p>Generics support was a huge addition to Vue.js and its arrival is a significant milestone. The introduction of this feature simplified the process of representing dynamic types that are essential for achieving the required flexibility in specific scenarios. Also, the <code>generic=&quot;&quot;</code> attribute is a seamless and natural addition to Vue SFC syntax, which enhances the language&#39;s expressiveness. I hope to see more and more libraries (particularly UI ones) taking advantage of generics and improving their type safety!</p>',37),i=[c];function y(D,F,C,A,u,d){return p(),o("div",null,i)}const g=l(r,[["render",y]]);export{m as __pageData,g as default};