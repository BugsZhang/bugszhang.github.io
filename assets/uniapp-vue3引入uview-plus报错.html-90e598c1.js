import{_ as s,O as a,P as e,Q as i,a4 as n}from"./framework-da0f5fb4.js";const t="/assets/uniapp-vue3引入uview-plus报错-234de81c.png",p={},o=n('<h1 id="uniapp-vue3引入uview-plus报错" tabindex="-1"><a class="header-anchor" href="#uniapp-vue3引入uview-plus报错" aria-hidden="true">#</a> uniapp-vue3引入uview-plus报错</h1><figure><img src="'+t+`" alt="uniapp-vue3引入uview-plus报错" tabindex="0" loading="lazy"><figcaption>uniapp-vue3引入uview-plus报错</figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>reportJSException &gt;&gt;&gt;&gt; exception function:createInstanceContext, exception:white screen cause create instanceContext failed,check js stack -&gt;Uncaught TypeError: Cannot read property &#39;http&#39; of undefined
 at  (app-service.js:4711:25)
 at  (app-service.js:33540:3)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>翻译：xxx创建失败导致白屏，xxxx，不能从undefined读取http</p><p>很明显，能用到http也就uview里的封装方法<code>uni.$u.http</code>，也就是$u不存在</p><p>uview将一些方法都挂载到了uni.$u下，一般情况下直接访问就行了。</p>`,6),l=n(`<p>直接面向搜索引擎，报错都相同，但没找到一样的。</p><p>不得已，那我只能把这个<code>$u</code>重写一遍了：</p><p>新建一个目录，common，然后在common下新建一个index.ts，直接把uview里相关的复制过来，内容如下</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>	
<span class="token comment">// 引入全局mixin</span>
<span class="token keyword">import</span> mixin <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/mixin/mixin.js&#39;</span>
<span class="token comment">// 小程序特有的mixin</span>
<span class="token keyword">import</span> mpMixin <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/mixin/mpMixin.js&#39;</span>
<span class="token comment">// 全局挂载引入http相关请求拦截插件</span>
<span class="token keyword">import</span> Request <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/luch-request&#39;</span>

<span class="token comment">// 路由封装</span>
<span class="token keyword">import</span> route <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/util/route.js&#39;</span>
<span class="token comment">// 颜色渐变相关,colorGradient-颜色渐变,hexToRgb-十六进制颜色转rgb颜色,rgbToHex-rgb转十六进制</span>
<span class="token keyword">import</span> colorGradient <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/function/colorGradient.js&#39;</span>

<span class="token comment">// 规则检验</span>
<span class="token keyword">import</span> test <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/function/test.js&#39;</span>
<span class="token comment">// 防抖方法</span>
<span class="token keyword">import</span> debounce <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/function/debounce.js&#39;</span>
<span class="token comment">// 节流方法</span>
<span class="token keyword">import</span> throttle <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/function/throttle.js&#39;</span>
<span class="token comment">// 公共文件写入的方法</span>
<span class="token keyword">import</span> index <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/function/index.js&#39;</span>

<span class="token comment">// 配置信息</span>
<span class="token keyword">import</span> config <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/config/config.js&#39;</span>
<span class="token comment">// props配置信息</span>
<span class="token keyword">import</span> props <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/config/props.js&#39;</span>
<span class="token comment">// 各个需要fixed的地方的z-index配置文件</span>
<span class="token keyword">import</span> zIndex <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/config/zIndex.js&#39;</span>
<span class="token comment">// 关于颜色的配置，特殊场景使用</span>
<span class="token keyword">import</span> color <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/config/color.js&#39;</span>
<span class="token comment">// 平台</span>
<span class="token keyword">import</span> platform <span class="token keyword">from</span> <span class="token string">&#39;@/uni_modules/uview-plus/libs/function/platform&#39;</span>
	
<span class="token keyword">const</span> $uviewCommon <span class="token operator">=</span> <span class="token punctuation">{</span>
	route<span class="token punctuation">,</span>
	<span class="token literal-property property">date</span><span class="token operator">:</span> index<span class="token punctuation">.</span>timeFormat<span class="token punctuation">,</span> <span class="token comment">// 另名date</span>
	<span class="token literal-property property">colorGradient</span><span class="token operator">:</span> colorGradient<span class="token punctuation">.</span>colorGradient<span class="token punctuation">,</span>
	<span class="token literal-property property">hexToRgb</span><span class="token operator">:</span> colorGradient<span class="token punctuation">.</span>hexToRgb<span class="token punctuation">,</span>
	<span class="token literal-property property">rgbToHex</span><span class="token operator">:</span> colorGradient<span class="token punctuation">.</span>rgbToHex<span class="token punctuation">,</span>
	<span class="token literal-property property">colorToRgba</span><span class="token operator">:</span> colorGradient<span class="token punctuation">.</span>colorToRgba<span class="token punctuation">,</span>
	test<span class="token punctuation">,</span>
	<span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;primary&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;success&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;error&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;warning&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;info&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
	<span class="token literal-property property">http</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Request</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
	config<span class="token punctuation">,</span> <span class="token comment">// uView配置信息相关，比如版本号</span>
	zIndex<span class="token punctuation">,</span>
	debounce<span class="token punctuation">,</span>
	throttle<span class="token punctuation">,</span>
	mixin<span class="token punctuation">,</span>
	mpMixin<span class="token punctuation">,</span>
	props<span class="token punctuation">,</span>
	<span class="token operator">...</span>index<span class="token punctuation">,</span>
	color<span class="token punctuation">,</span>
	platform
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> $uviewCommon

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我改名为了<code>$uviewCommon</code>，然后哪里需要用<code>uni.$u.http</code>以及其他方法的，直接</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import $uviewCommon from &#39;@/common&#39;

$uviewCommon.xxx()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6);function c(r,u){return a(),e("div",null,[o,i("（另一个分支上的vue3+uview-plus+nvue就没有问题，我甚至把那个分支拷贝一份，然后将文件都替换进去也会报这个错误，所以我到现在也不知道问题出在哪里）"),l])}const m=s(p,[["render",c],["__file","uniapp-vue3引入uview-plus报错.html.vue"]]);export{m as default};
