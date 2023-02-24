import{_ as n,O as s,P as a,a4 as t}from"./framework-da0f5fb4.js";const e={},p=t(`<div class="hint-container tip"><p class="hint-container-title">提示</p><p>第一次使用pinia，不太熟练，跟vuex不太一样，所以遇到的报错也很奇怪</p></div><h1 id="引入pinia白屏" tabindex="-1"><a class="header-anchor" href="#引入pinia白屏" aria-hidden="true">#</a> 引入pinia白屏</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>reportJSException &gt;&gt;&gt;&gt; exception function:createInstanceContext,
exception:white screen cause create instanceContext failed,check js
stack -&gt; /at useStore (app-service.js:2309:15)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一次出现这个问题是因为在<code>main.js</code>里忘了把pinia return出去</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// main.js</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> Pinia <span class="token keyword">from</span> <span class="token string">&#39;pinia&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createApp</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createSSRApp</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span><span class="token punctuation">;</span>
  
	app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>Pinia<span class="token punctuation">.</span><span class="token function">createPinia</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 这里将会引发下一个问题</span>

	<span class="token keyword">return</span> <span class="token punctuation">{</span>
		app<span class="token punctuation">,</span>
		Pinia
	<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="外部js调用pinia" tabindex="-1"><a class="header-anchor" href="#外部js调用pinia" aria-hidden="true">#</a> 外部js调用pinia</h1><h4 id="外部js调用pinia时-报错getactivepinia-was-called-with-no-active-pinia-did-you-forget-to-install-pinia" tabindex="-1"><a class="header-anchor" href="#外部js调用pinia时-报错getactivepinia-was-called-with-no-active-pinia-did-you-forget-to-install-pinia" aria-hidden="true">#</a> 外部js调用pinia时，报错getActivePinia was called with no active Pinia. Did you forget to install pinia？</h4><p>原因是因为pinia在<code>main.js</code>中还未注册好，便在其他文件中使用了它。</p><p>我在登录界面将token存在了store里面，想在请求拦截器将token添加到请求头，在使用store的时候报了这个错误。</p><p>一开始我是这样写的</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// interceptors.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>useUserStore<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/store/user&quot;</span>
<span class="token keyword">const</span> userStore <span class="token operator">=</span> <span class="token function">useUserStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> <span class="token function-variable function">requestInterceptors</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
	<span class="token doc-comment comment">/**
	 * 请求拦截
	 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">http</span>
	 */</span>
	uni<span class="token punctuation">.</span>$u<span class="token punctuation">.</span>http<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>
		<span class="token parameter">config</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token punctuation">(</span>userStore<span class="token punctuation">.</span>token<span class="token punctuation">)</span> <span class="token punctuation">{</span>
				config<span class="token punctuation">.</span>header <span class="token operator">=</span> <span class="token punctuation">{</span>
					<span class="token operator">...</span>config<span class="token punctuation">.</span>header<span class="token punctuation">,</span>
					<span class="token literal-property property">Authorization</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>userStore<span class="token punctuation">.</span>token<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
				<span class="token punctuation">}</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span>
            <span class="token comment">// ... 代码</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">(</span>
			<span class="token parameter">config</span> 
		<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> Promise<span class="token punctuation">.</span><span class="token function">reject</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
	<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后就报了上述错误，查了查文档，看说是需要再把pinia自己给传回去，然后我就这样写了</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// interceptors.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>useUserStore<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/store/user&quot;</span>

<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> Pinia <span class="token keyword">from</span> <span class="token string">&#39;pinia&#39;</span>

<span class="token keyword">const</span> userStore <span class="token operator">=</span> <span class="token function">useUserStore</span><span class="token punctuation">(</span>Pinia<span class="token punctuation">.</span><span class="token function">createPinia</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> <span class="token function-variable function">requestInterceptors</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
	<span class="token doc-comment comment">/**
	 * 请求拦截
	 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">http</span>
	 */</span>
	uni<span class="token punctuation">.</span>$u<span class="token punctuation">.</span>http<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>
		<span class="token parameter">config</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token punctuation">(</span>userStore<span class="token punctuation">.</span>token<span class="token punctuation">)</span> <span class="token punctuation">{</span>
				config<span class="token punctuation">.</span>header <span class="token operator">=</span> <span class="token punctuation">{</span>
					<span class="token operator">...</span>config<span class="token punctuation">.</span>header<span class="token punctuation">,</span>
					<span class="token literal-property property">Authorization</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>userStore<span class="token punctuation">.</span>token<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
				<span class="token punctuation">}</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span>
			<span class="token comment">// ... 代码</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">(</span>
			<span class="token parameter">config</span>
		<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> Promise<span class="token punctuation">.</span><span class="token function">reject</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
	<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line"> </div><br><div class="highlight-line"> </div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>有可能是因为这个，也可能是我哪里写错了，还没发现</p><p>2023年2月20日，如果以后发现是写错了，我在回来改</p></div><p>但是这样写还是有问题，登录界面token明明已经存储上了，这里使用还是空的，这就回到了第一个问题白屏那里的注释<code>app.use(Pinia.createPinia()); // 这里将会引发下一个问题</code>，因为<code>main.js</code>里的<code>Pinia.createPinia()</code>和拦截器里的<code>Pinia.createPinia()</code>相当于创建了两个pinia，所以才会导致登录存储上了，但这里仍是空</p><p>解决办法：单独创建一个store.js：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { createPinia } from &#39;pinia&#39;;
const pinia = createPinia();
export default pinia;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后<code>main.js </code>引入该文件，用来注册pinia：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// main.js</span>
<span class="token keyword">import</span> pinia <span class="token keyword">from</span> <span class="token string">&quot;@/store/store&quot;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createApp</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createSSRApp</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span><span class="token punctuation">;</span>
  
	app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>pinia<span class="token punctuation">)</span>
  
	<span class="token keyword">return</span> <span class="token punctuation">{</span>
		app<span class="token punctuation">,</span>
		Pinia
	<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其他外部js同样引入这个pinia</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// interceptors.js</span>
<span class="token keyword">import</span> pinia <span class="token keyword">from</span> <span class="token string">&#39;@/store/store&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>useUserStore<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/store/user&quot;</span>
<span class="token keyword">const</span> userStore <span class="token operator">=</span> <span class="token function">useUserStore</span><span class="token punctuation">(</span>pinia<span class="token punctuation">)</span>

<span class="token keyword">const</span> <span class="token function-variable function">requestInterceptors</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
	<span class="token doc-comment comment">/**
	 * 请求拦截
	 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">http</span>
	 */</span>
	uni<span class="token punctuation">.</span>$u<span class="token punctuation">.</span>http<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>
		<span class="token parameter">config</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token punctuation">(</span>userStore<span class="token punctuation">.</span>token<span class="token punctuation">)</span> <span class="token punctuation">{</span>
				config<span class="token punctuation">.</span>header <span class="token operator">=</span> <span class="token punctuation">{</span>
					<span class="token operator">...</span>config<span class="token punctuation">.</span>header<span class="token punctuation">,</span>
					<span class="token literal-property property">Authorization</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>userStore<span class="token punctuation">.</span>token<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
				<span class="token punctuation">}</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span>
            <span class="token comment">// ... 代码</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">(</span>
			<span class="token parameter">config</span> 
		<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> Promise<span class="token punctuation">.</span><span class="token function">reject</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
	<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21),i=[p];function o(c,l){return s(),a("div",null,i)}const r=n(e,[["render",o],["__file","2-20-uniapp引入pinia报错.html.vue"]]);export{r as default};
