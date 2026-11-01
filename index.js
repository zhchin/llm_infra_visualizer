/* ==========================================================================
   LLM Infra Visualizer - Dynamic Mathematics & UI Logic (index.js)
   ========================================================================== */

// i18n Translation Dictionary
const i18n = {
    zh: {
        page_title: "LLM Infra Visualizer",
        page_subtitle: "第一性原理 (First Principles) 硬體極限與 Token 經濟學動態模擬器",
        scenario_title: "動態理論場景：",
        scenario_fast: "極速低延遲解碼 (Fast Mode)",
        scenario_long: "極長上下文牆 (Long Context Wall)",
        scenario_high: "高吞吐生產批次 (High Throughput)",
        scenario_collapse: "MoE 跨機架崩潰 (MoE Collapse)",
        scenario_optimized: "Pipelining 優化 (Comm Optimized)",
        sec_hardware_title: "硬體 & 晶片規格",
        label_gpu_flops: "單卡算力峰值",
        label_gpu_bandwidth: "HBM 記憶體頻寬",
        sec_model_title: "模型 & 精度規格",
        label_total_params: "總參數量 (Total Params)",
        label_active_params: "激活參數量 (Active Params)",
        label_precision: "權重精度 (Precision)",
        sec_inference_title: "推論 & 場景參數",
        label_batch_size: "批次大小 Batch Size (B)",
        label_context_length: "上下文長度 (Context Length / L)",
        label_kv_token: "KV Cache 大小 / Token",
        label_prompt_cache: "提示詞快取命中率 (Prompt Cache Hit Rate)",
        sec_moe_title: "MoE & 機架通訊參數",
        label_moe_gamma: "機架外頻寬降幅 (gamma)",
        label_moe_experts: "激活專家數 (E_active)",
        label_moe_layers: "每個 Stage 層數 (N_layer)",
        label_moe_efficiency: "通訊網路傳輸效率 (eta)",
        bottleneck_title: "目前晶片運行瓶頸：",
        comm_title: "跨機架通訊狀態：",
        metric_t_compute: "Step 計算耗時 (t_compute)",
        metric_t_mem: "Step 記憶體讀取耗時 (t_mem)",
        metric_b_optimal: "最適權重平衡批次 (B_crossover)",
        metric_t_ttft: "首字延遲 (TTFT)",
        chart_title: "動態 Roofline 分析圖表",
        topology_title: "集群機架拓撲與 NVLink 通訊頻寬視覺化",
        topo_preset_dual: "雙機架混合 (NVLink + IB)",
        topo_preset_single: "單機架全互聯 (Superpod)",
        topo_preset_multi: "多機架分散式 (Ethernet)",
        topo_badge_safe: "NVLink / IB: 安全",
        topo_badge_warn: "警告: 延遲 {gamma} 倍慢",
        topo_badge_collapse: "崩潰: 機架通訊瓶頸",
        topo_badge_single_status: "NVLINK: 1.8 TB/s (無阻塞)",
        topo_badge_multi_status: "ETHERNET: 網路頻寬嚴重瓶頸",
        topo_switch_subtitle: "Scale-out 節點",
        edu_section_title: "大模型硬體理論核心庫",
        
        // KV Cache Offload Calculator i18n keys (Chinese)
        kv_offload_title: "KV Cache 多級存儲與移載經濟決策器",
        kv_offload_desc: "基於第一性原理折算：將快取保留在 HBM、移載至 DDR / SSD / HDD，或是直接刪除重算 (Remat) 的機會成本對比。",
        label_retention_time: "快取閒置保存時間 (Retention Time)",
        optimal_strategy: "推薦最優策略：",
        opt_remat: "1. Recompute (重新計算)",
        opt_hbm: "2. Keep in HBM (保留在 HBM)",
        opt_ddr: "3. DDR Host Offload (移載到 DDR)",
        opt_ssd: "4. Flash/SSD Offload (移載到 SSD)",
        opt_hdd: "5. HDD Offload (移載到 HDD)",
        strategy_recompute: "REMATERIALIZATION (重新計算)",
        strategy_hbm: "KEEP IN HBM (保留在 HBM)",
        strategy_ddr: "DDR HOST OFFLOAD (移載到 DDR)",
        strategy_ssd: "FLASH/SSD OFFLOAD (移載到 SSD)",
        strategy_hdd: "HDD OFFLOAD (移載到 HDD)",
        recompute_details: "重算延遲: {time}ms | 空間持有: $0.00",
        storage_details: "讀取延遲: {retTime}ms | 空間持有: ${holdCost}/hr",
        storage_overflow: "讀取延遲: 空間溢出 | 空間持有: 超載限額",
        
        // Card 1
        card1_title: "1. Roofline Model 與推論瓶頸",
        card1_p: "解碼階段 (Decode Step) 是自迴歸生成的核心。每生成一個 Token，系統必須在「計算時間」與「記憶體加載時間」兩者間取最大值，這在晶片級限制了效能。",
        card1_quote: "「如果你不把許多使用者 Batch 在一起，你得到的經濟效益會差上千倍。」— Reiner Pope",
        
        // Card 2
        card2_title: "2. 最適權重平衡 Batch 點推導",
        card2_p: "當不考慮 KV Cache 且算力時間等於記憶體讀取權重的時間時，晶片的使用效率（MFU）最高。此時的臨界 Batch Size ($B_{\\text{optimal}}$) 取決於硬體的算力頻寬比與稀疏度。",
        card2_quote: "「在現代 GPU 上，算力/頻寬比（FLOPs/Bandwidth）通常維持在非常穩定的 300 左右。」— Reiner Pope",
        
        // Card 3
        card3_title: "3. 機架通訊與 MoE 部署限制",
        card3_p: "EP（專家平行）將不同的 MoE 專家分發在不同 GPU 上。但這引發了全對全（All-to-All）通訊瓶頸。NVLink 僅在單機架（Scale-up）內極快，跨機架（Scale-out）會因頻寬驟降而嚴重卡頓。",
        card3_quote: "「這就是為什麼 Ilya 曾說：『正如我們現在所知，做過細的 Pipelining 是不明智的。』」— Reiner Pope",
        
        // Card 4
        card4_title: "4. 預算均等與 100 倍 Over-training",
        card4_p: "為了優化「預訓練、RL 訓練與推理服務」三者的總花費，三者的算力成本應達到 Heuristic 均衡。由於推理量龐大，為了降低推理成本，在預訓練階段超量訓練大約 100 倍是最合適的選擇。",
        card4_quote: "「大模型的最佳預訓練 Token 量，本質上應由該模型在生命週期中將產生的總推理 Token 數決定。」— Reiner Pope",
        
        // Card 5
        card5_title: "5. Feistel Cipher 與 可逆網絡 RevNets",
        card5_p: "RevNets 借用了密碼學中 Feistel Cipher 的可逆結構，讓整個 Transformer 的前向傳播在數學上完全可逆。這讓訓練時不需要保留中間 Activation 狀態，在 Backward 時動態反解，極致省下 HBM 空間。",
        card5_quote: "「這與 KV Cache 剛好相反：RevNets 是多花算力來省記憶體；KV Cache 是多用記憶體來省算力。」— Reiner Pope",
        
        // Sliders/Metrics details
        moe_gamma_suffix: " 倍慢",
        moe_experts_suffix: " 個",
        moe_layers_suffix: " 層",
        comm_safe: "COMMUNICATION SAFE (跨機架通訊安全)",
        comm_bottleneck: "COMMUNICATION BOTTLENECK (跨機架通訊瓶頸)",
        compute_bound: "COMPUTE BOUND (晶片算力受限)",
        memory_bound: "MEMORY BANDWIDTH BOUND (記憶體頻寬受限)",
        weight_fetch_percent: "Weight 讀取佔比 {percent}%",
        kv_fetch_percent: "KV Cache 讀取佔比 {percent}%",
        mem_load_percent: "記憶體頻寬負載約 {percent}%",
        t_scale_ratio: "比值 t_scale-up / t_scale-out = {ratio}",
        topo_badge_dense_safe: "Dense 模型: 無 MoE EP 瓶頸",
        dense_no_ep_comm: "Dense 架構 (無專家集體通訊)",
        dense_comm_safe: "DENSE MODEL SAFE (Dense 架構不受 All-to-All 瓶頸限制)",
        cluster_telemetry_label: "自動推算 GPU 集群大小:",
        
        // Chatbot UI
        chat_title: "小Z AI 助手",
        chat_online: "在線上 (LLM Infra 專家)",
        settings_btn: "API 連線設定",
        settings_title: "API 連線與模型設定",
        settings_endpoint: "API 端點 (Endpoint)",
        settings_key: "API 金鑰 (Key)",
        settings_model: "模型 (Model)",
        settings_save: "儲存連線設定",
        settings_success: "✅ <strong>連線設定更新成功！</strong><br>目前端點：<code>{endpoint}</code><br>當前模型：<code>{model}</code>",
        settings_demo_note: "目前預設為 Demo Mode：不會呼叫任何付費 LLM API。若要啟用完整 LLM 回覆，請填入自己的 API Endpoint、API Key 與 Model。API Key 只會儲存在瀏覽器 localStorage，不會被上傳到本專案或任何中介伺服器；送出聊天時只會由你的瀏覽器直接用於你指定的 API endpoint。",
        settings_demo_active: "✅ <strong>Demo Mode 已啟用。</strong><br>未偵測到完整 API 設定，因此小Z會使用免費的規則式教學模式，不會呼叫外部 LLM API。",
        chat_welcome_1: "你好，我是 <strong>小Z</strong>，一個 LLM Infra 專家。歡迎來到 LLM 推論與 Token 經濟學互動教學面板！",
        chat_welcome_2: "你可以問我任何關於<strong>解碼 Roofline 模型、最適 Batch Size 推導、MoE 跨機架通訊瓶頸、KV Cache 多級存儲機會成本折算 或是 100 倍超量預訓練</strong>的硬體物理理論與實踐。",
        chat_welcome_3: "更棒的是，你可以直接命令我：<em>「幫我把 Batch Size 改成 512」</em>，或是<em>「切換到 MoE 跨機架崩潰場景」</em>，我會自動幫你在網頁中完成參數調整！你想從哪個話題開始？",
        chat_demo_notice: "<span class=\"demo-mode-label\">Demo Mode</span><br>目前線上展示預設使用免費規則式 Demo Mode，不會呼叫付費 LLM API。若要啟用完整 LLM 回覆，請點右上角 ⚙️ 填入自己的 API 設定；API Key 只會存在你的瀏覽器 localStorage，不會被上傳到本專案或任何中介伺服器。",
        demo_prefix: "<span class=\"demo-mode-label\">Demo Mode</span><br><strong>這是免費規則式示範回覆，沒有呼叫外部 LLM API。</strong><br>",
        demo_control_hint: "我已用 Demo Mode 幫你調整面板參數。你也可以試試：「Batch Size 512」、「切換到長上下文」、「MoE collapse」。",
        demo_batch_explain: "Batch Size 是推論服務經濟性的核心旋鈕。低 Batch 解碼通常要反覆讀取模型權重，因此容易 memory-bound；提高 Batch 後，同一次權重讀取可服務更多序列，系統會更接近 compute-bound。",
        demo_kv_explain: "KV Cache 會隨 Batch Size 與 Context Length 線性成長。長上下文下，即使模型權重不變，KV 搬運與保存成本也會快速變成主要瓶頸。",
        demo_moe_explain: "MoE 只啟用部分專家以降低單 token 計算量，但 expert routing 會引入 All-to-All 通訊。當專家分散到跨機架 GPU 時，網路頻寬與延遲可能吞掉稀疏化帶來的好處。",
        demo_memory_explain: "Memory-bound 代表每步生成的瓶頸不是 FLOPS，而是把權重與 KV Cache 從 HBM 搬到運算單元的速度。這也是為什麼單使用者 decode 常常無法把 GPU 算力吃滿。",
        demo_default_explain: "我可以在 Demo Mode 中回答常見教學問題，也能控制幾個預設場景。請試試：解釋 KV Cache、為什麼 memory-bound、Batch Size 512、切換到 MoE collapse、切換到長上下文。",
        chat_placeholder: "詢問小Z物理極限，或讓我設定參數...",
        suggest_optimal: "解釋最適 Batch Size 公式",
        suggest_moe: "什麼是 MoE 的跨機架崩潰？",
        suggest_long: "幫我設定為長上下文場景",
        api_error_title: "⚠️ <strong>連線異常</strong>：無法成功與指定的 LLM API 端點完成通訊。",
        api_error_desc: "常見原因：<br>1. API 端點不支援 CORS 跨網域請求阻擋。<br>2. 本地網路環境或網路代理阻擋。<br>3. API Key 或 Model 錯誤。",
        api_error_check: "請點擊右上方 ⚙️ 齒輪確認 API Endpoint (<code>{endpoint}</code>) 與 API Key 是否無誤。",
        ai_updating_params: "🛠️ <strong>AI 已替您更新設定：</strong>{actions}",
        
        // Chart
        chart_compute_limit: "算力限額 t_compute",
        chart_mem_limit: "頻寬總限額 t_mem",
        chart_weight_fetch: "權重讀取耗時 t_weights (水平線)",
        chart_kv_fetch: "KV Cache 讀取耗時 t_kv",
        chart_actual_latency: "實際延遲 t_step (Max)",
        chart_current_batch: "當前 Batch Size 定位",
        chart_y_axis: "每 Step 推論延遲 (Latency / ms)",
        
        // Extras
        footer_desc: "基於 Reiner Pope x Dwarkesh Patel Blackboard Lecture 訪談錄第一性原理推導與硬體規格建立。",
        close_btn: "關閉",
        chat_trigger_btn_aria: "打開 AI 助手",
        document_title: "LLM 推論架構與 Token 經濟學互動教學面板 (LLM Infra Visualizer)"
    },
    en: {
        page_title: "LLM Infra Visualizer",
        page_subtitle: "First-Principles Hardware Limits & Token Economics Dynamic Simulator",
        scenario_title: "Dynamic Scenario:",
        scenario_fast: "Fast Low-Latency Decode (Fast Mode)",
        scenario_long: "Ultra-Long Context Wall (Long Context Wall)",
        scenario_high: "High Throughput Batch (High Throughput)",
        scenario_collapse: "MoE Cross-Rack Collapse (MoE Collapse)",
        scenario_optimized: "Pipelining Optimization (Comm Optimized)",
        sec_hardware_title: "Hardware & Chip Specs",
        label_gpu_flops: "Single-GPU Peak Compute",
        label_gpu_bandwidth: "HBM Memory Bandwidth",
        sec_model_title: "Model & Precision Specs",
        label_total_params: "Total Parameters (Total Params)",
        label_active_params: "Active Parameters (Active Params)",
        label_precision: "Weight Precision (Precision)",
        sec_inference_title: "Inference & Scenario Params",
        label_batch_size: "Batch Size (B)",
        label_context_length: "Context Length (L)",
        label_kv_token: "KV Cache Size / Token",
        label_prompt_cache: "Prompt Cache Hit Rate",
        sec_moe_title: "MoE & Rack Communication Params",
        label_moe_gamma: "Scale-out Bandwidth Decrease (gamma)",
        label_moe_experts: "Active Experts (E_active)",
        label_moe_layers: "Layers per Stage (N_layer)",
        label_moe_efficiency: "Comm Network Efficiency (eta)",
        bottleneck_title: "Current Chip Bottleneck:",
        comm_title: "Cross-Rack Comm Status:",
        metric_t_compute: "Step Compute Time (t_compute)",
        metric_t_mem: "Step Memory Time (t_mem)",
        metric_b_optimal: "Optimal Balanced Batch (B_crossover)",
        metric_t_ttft: "Time to First Token (TTFT)",
        chart_title: "Dynamic Roofline Analysis Chart",
        topology_title: "Cluster & Rack Topology & NVLink Bandwidth Visualizer",
        topo_preset_dual: "Dual-Rack Hybrid (NVLink + IB)",
        topo_preset_single: "Single-Rack Superpod (NVLink)",
        topo_preset_multi: "Multi-Rack Scale-out (Ethernet)",
        topo_badge_safe: "NVLink / IB: SAFE",
        topo_badge_warn: "WARN: {gamma}x Delay",
        topo_badge_collapse: "COLLAPSE: Rack Bottleneck",
        topo_badge_single_status: "NVLINK: 1.8 TB/s (Non-blocking)",
        topo_badge_multi_status: "ETHERNET: Extreme Network Bottleneck",
        topo_switch_subtitle: "Scale-out Node",
        edu_section_title: "LLM Hardware Theory Core Library",
        
        // KV Cache Offload Calculator i18n keys (English)
        kv_offload_title: "KV Cache Multi-Tier Storage & Offload Economics",
        kv_offload_desc: "First-principles calculation comparing HBM storage, offloading to Host DDR / SSD / HDD, or deleting to recompute (Remat) opportunity cost.",
        label_retention_time: "Cache Retention Time (Idle Time)",
        optimal_strategy: "Optimal Strategy:",
        opt_remat: "1. Recompute (Rematerialize)",
        opt_hbm: "2. Keep in HBM (Local Storage)",
        opt_ddr: "3. DDR Host Offload (To CPU RAM)",
        opt_ssd: "4. Flash/SSD Offload (To NVMe SSD)",
        opt_hdd: "5. HDD Offload (To Spinning Disk)",
        strategy_recompute: "REMATERIALIZATION (RECOMPUTE)",
        strategy_hbm: "KEEP IN HBM (LOCAL STORAGE)",
        strategy_ddr: "DDR HOST OFFLOAD (CPU RAM)",
        strategy_ssd: "FLASH/SSD OFFLOAD (NVMe SSD)",
        strategy_hdd: "HDD OFFLOAD (SPINNING DISK)",
        recompute_details: "Recompute Latency: {time}ms | Space holding: $0.00",
        storage_details: "Retrieve Latency: {retTime}ms | Space holding: ${holdCost}/hr",
        storage_overflow: "Retrieve Latency: Memory Overflow | Space holding: OVERLIMIT",
        
        // Card 1
        card1_title: "1. Roofline Model & Inference Bottleneck",
        card1_p: "The decode step is the core of autoregressive generation. For each generated token, the system must take the maximum of compute time and memory loading time, limiting performance at the chip level.",
        card1_quote: "“If you don't batch many users together, your economic benefits will be thousands of times worse.” — Reiner Pope",
        
        // Card 2
        card2_title: "2. Derivation of Optimal Balanced Batch Size",
        card2_p: "Without considering KV Cache, chip Model FLOPs Utilization (MFU) is maximized when compute time equals memory weight reading time. The critical batch size ($B_{\\text{optimal}}$) depends on hardware FLOPs-to-bandwidth ratio and sparsity.",
        card2_quote: "“On modern GPUs, the FLOPs/bandwidth ratio typically stays very stable around 300.” — Reiner Pope",
        
        // Card 3
        card3_title: "3. Rack Communication & MoE Deploy Limits",
        card3_p: "Expert Parallelism (EP) distributes MoE experts across GPUs, triggering All-to-All communication bottlenecks. NVLink is extremely fast within a single rack (scale-up), but cross-rack (scale-out) bandwidth drops drastically, causing severe stalls.",
        card3_quote: "“That's why Ilya famously said: 'As we know now, too fine-grained pipelining is not wise.'” — Reiner Pope",
        
        // Card 4
        card4_title: "4. Equal Budgets & 100x Over-training",
        card4_p: "To optimize total costs across pretraining, RL, and inference, compute budgets should reach a heuristic balance. Since inference volume is massive, overtraining by ~100x beyond Chinchilla optimal is a rational choice to keep models small and squeeze inference costs.",
        card4_quote: "“The optimal pretraining token volume should fundamentally be determined by the total inference tokens generated over the model's lifetime.” — Reiner Pope",
        
        // Card 5
        card5_title: "5. Feistel Cipher & Reversible Networks (RevNets)",
        card5_p: "RevNets adopt the reversible structure of Feistel Cipher in cryptography, making the Transformer forward pass mathematically reversible. This eliminates the need to store intermediate activations during training, dynamically solving them in backward pass to save HBM.",
        card5_quote: "“This is the exact conjugate of KV Cache: RevNets trade compute for memory; KV Cache trades memory for compute.” — Reiner Pope",
        
        // Sliders/Metrics details
        moe_gamma_suffix: "x slower",
        moe_experts_suffix: " experts",
        moe_layers_suffix: " layers",
        comm_safe: "COMMUNICATION SAFE",
        comm_bottleneck: "COMMUNICATION BOTTLENECK",
        compute_bound: "COMPUTE BOUND",
        memory_bound: "MEMORY BANDWIDTH BOUND",
        weight_fetch_percent: "Weight Fetch takes {percent}%",
        kv_fetch_percent: "KV Cache Fetch takes {percent}%",
        mem_load_percent: "Memory Bandwidth Load ~{percent}%",
        t_scale_ratio: "Ratio t_scale-up / t_scale-out = {ratio}",
        topo_badge_dense_safe: "Dense Model: No MoE EP Bottleneck",
        dense_no_ep_comm: "Dense Model (No EP Routing All-to-All)",
        dense_comm_safe: "DENSE MODEL SAFE (Immune to MoE All-to-All bottlenecks)",
        cluster_telemetry_label: "Auto-Calculated GPU Cluster Size:",
        
        // Chatbot UI
        chat_title: "Z-AI Assistant",
        chat_online: "Online (LLM Infra Expert)",
        settings_btn: "API Settings",
        settings_title: "API Connection & Model Settings",
        settings_endpoint: "API Endpoint",
        settings_key: "API Key",
        settings_model: "Model",
        settings_save: "Save Connection Settings",
        settings_success: "✅ <strong>Connection settings updated!</strong><br>Endpoint: <code>{endpoint}</code><br>Model: <code>{model}</code>",
        settings_demo_note: "Default hosted behavior is Demo Mode: no paid LLM API is called. To enable full LLM responses, enter your own API Endpoint, API Key, and Model. Your API key is stored only in browser localStorage and is not uploaded to this project or any proxy server; when you send a chat request, your browser uses it directly with the API endpoint you configured.",
        settings_demo_active: "✅ <strong>Demo Mode is active.</strong><br>No complete API configuration was detected, so Little Z will use the free rule-based teaching mode and will not call an external LLM API.",
        chat_welcome_1: "Hello! I'm <strong>Little Z</strong>, an LLM Infra Expert. Welcome to the LLM Inference & Token Economics Interactive Simulator!",
        chat_welcome_2: "Feel free to ask me anything about <strong>decoding Roofline models, optimal batch size derivations, MoE rack comm bottlenecks, KV Cache multi-tier storage offloading economics, or 100x pretraining overtraining</strong>.",
        chat_welcome_3: "Even better, directly command me: <em>'Set batch size to 512'</em> or <em>'Switch to MoE Rack Collapse scenario'</em>. I will automatically slide the knobs for you in real-time! Where shall we begin?",
        chat_demo_notice: "<span class=\"demo-mode-label\">Demo Mode</span><br>The hosted demo uses a free rule-based Demo Mode by default and does not call a paid LLM API. To enable full LLM responses, click ⚙️ and enter your own API settings. Your API key stays in browser localStorage and is not uploaded to this project or any proxy server.",
        demo_prefix: "<span class=\"demo-mode-label\">Demo Mode</span><br><strong>This is a free rule-based demo response. No external LLM API was called.</strong><br>",
        demo_control_hint: "I updated the dashboard with Demo Mode. You can also try: 'Batch Size 512', 'switch to long context', or 'MoE collapse'.",
        demo_batch_explain: "Batch size is a core serving-economics knob. Low-batch decoding repeatedly reads model weights, so it is often memory-bound. As batch size rises, each weight read serves more sequences and the workload moves closer to compute-bound.",
        demo_kv_explain: "KV cache grows linearly with batch size and context length. In long-context inference, even if model weights stay fixed, KV movement and retention cost can become first-order bottlenecks.",
        demo_moe_explain: "MoE reduces per-token compute by activating only some experts, but expert routing introduces All-to-All communication. When experts span racks, network bandwidth and latency can eat the gains from sparsity.",
        demo_memory_explain: "Memory-bound means the step is limited less by FLOPS and more by moving weights and KV cache from HBM into the compute units. This is why single-user decode often cannot fully utilize GPU compute.",
        demo_default_explain: "In Demo Mode I can answer common educational prompts and control a few presets. Try: explain KV cache, why memory-bound, Batch Size 512, switch to MoE collapse, or switch to long context.",
        chat_placeholder: "Ask Little Z about physical limits, or command me to set parameters...",
        suggest_optimal: "Explain optimal batch size formula",
        suggest_moe: "What is MoE cross-rack collapse?",
        suggest_long: "Set to long context scenario",
        api_error_title: "⚠️ <strong>Connection Error</strong>: Failed to communicate with the specified LLM API endpoint.",
        api_error_desc: "Common reasons:<br>1. API endpoint does not support CORS (blocked by browser).<br>2. Local network or proxy block.<br>3. Incorrect API Key or Model.",
        api_error_check: "Please click ⚙️ settings in the top right to verify API Endpoint (<code>{endpoint}</code>) and API Key.",
        ai_updating_params: "🛠️ <strong>AI updated settings:</strong> {actions}",
        
        // Chart
        chart_compute_limit: "Compute Limit t_compute",
        chart_mem_limit: "Total Memory Limit t_mem",
        chart_weight_fetch: "Weight Fetch t_weights (Floor)",
        chart_kv_fetch: "KV Cache Fetch t_kv",
        chart_actual_latency: "Actual Latency t_step (Max)",
        chart_current_batch: "Current Batch Size Location",
        chart_y_axis: "Per-Step Inference Latency (Latency / ms)",
        
        // Extras
        footer_desc: "Based on first-principles derivations and hardware specifications from the Reiner Pope x Dwarkesh Patel Blackboard Lecture interview.",
        close_btn: "Close",
        chat_trigger_btn_aria: "Open AI Assistant",
        document_title: "LLM Infra Visualizer - First-Principles Hardware Limits & Token Economics Simulator"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key, vars = {}) {
    let translation = i18n[currentLang][key] || i18n['en'][key] || i18n['zh'][key] || key;
    Object.entries(vars).forEach(([k, v]) => {
        translation = translation.replace(`{${k}}`, v);
    });
    return translation;
}

// Global Slider formatting helper
function formatValue(key, val) {
    if (key === 'gpuFlops') return `${val} TFLOPS`;
    if (key === 'gpuBandwidth') return `${parseFloat(val).toFixed(1)} TB/s`;
    if (key === 'totalParams') return `${val} B`;
    if (key === 'activeParams') return `${val} B`;
    if (key === 'precision') {
        if (val == 0.5) return 'INT4 (0.5 B)';
        if (val == 1.0) return 'FP8 (1 Byte)';
        if (val == 2.0) return 'FP16 (2 Bytes)';
        return `${val} Bytes`;
    }
    if (key === 'batchSize') return `${val}`;
    if (key === 'contextLength') return parseInt(val).toLocaleString();
    if (key === 'kvToken') return `${parseFloat(val).toFixed(1)} KB`;
    if (key === 'promptCache') return `${val} %`;
    if (key === 'moeGamma') return `${parseFloat(val).toFixed(1)} ${t('moe_gamma_suffix')}`;
    if (key === 'moeExperts') return `${val} ${t('moe_experts_suffix')}`;
    if (key === 'moeLayers') return `${val} ${t('moe_layers_suffix')}`;
    if (key === 'moeEfficiency') return `${val} %`;
    return val;
}

// 1. Hardware Presets Database
const hardwarePresets = {
    blackwell: {
        flops: 2250,        // TFLOPS
        bandwidth: 8.0,     // TB/s
        totalParams: 671,   // B (DeepSeek V3 class)
        activeParams: 37,   // B
        precision: 1.0,     // FP8 (1 Byte)
        batchSize: 128,
        contextLength: 200000, // 200k tokens
        kvToken: 2.0,        // KB/token
        moeGamma: 8.0,
        moeExperts: 8,
        moeLayers: 2,
        moeEfficiency: 30
    },
    hopper: {
        flops: 1000,
        bandwidth: 3.35,
        totalParams: 175,   // GPT-3 class
        activeParams: 175,  // Dense model
        precision: 1.0,     // FP8 (1 Byte)
        batchSize: 64,
        contextLength: 32000,
        kvToken: 1.6,
        moeGamma: 8.0,
        moeExperts: 8,
        moeLayers: 2,
        moeEfficiency: 30
    },
    ampere: {
        flops: 312,
        bandwidth: 2.0,
        totalParams: 70,    // Llama-2-70B class
        activeParams: 70,
        precision: 2.0,     // FP16 (2 Bytes)
        batchSize: 32,
        contextLength: 8000,
        kvToken: 1.2,
        moeGamma: 8.0,
        moeExperts: 8,
        moeLayers: 2,
        moeEfficiency: 30
    },
    tpu: {
        flops: 197,
        bandwidth: 0.8,
        totalParams: 30,
        activeParams: 30,
        precision: 1.0,     // bfloat16 mixed / FP8
        batchSize: 32,
        contextLength: 4000,
        kvToken: 1.0,
        moeGamma: 8.0,
        moeExperts: 8,
        moeLayers: 2,
        moeEfficiency: 30
    }
};

// 1.5. Dynamic Inference Scenario Presets (All mapped on Blackwell for fair context comparison)
const scenarioPresets = {
    'fast-mode': {
        flops: 2250,
        bandwidth: 8.0,
        totalParams: 671,
        activeParams: 37,
        precision: 1.0,
        batchSize: 1,           // Single user premium speed
        contextLength: 4000,    // Short context
        kvToken: 2.0,
        moeGamma: 1.0,          // Single rack via high-speed NVLink, no extra-rack degradation
        moeExperts: 8,
        moeLayers: 2,
        moeEfficiency: 30
    },
    'long-context': {
        flops: 2250,
        bandwidth: 8.0,
        totalParams: 671,
        activeParams: 37,
        precision: 1.0,
        batchSize: 32,          // Medium concurrent users
        contextLength: 1000000, // 1M Long Context Wall
        kvToken: 2.0,
        moeGamma: 8.0,
        moeExperts: 8,
        moeLayers: 2,
        moeEfficiency: 30
    },
    'high-throughput': {
        flops: 2250,
        bandwidth: 8.0,
        totalParams: 671,
        activeParams: 37,
        precision: 1.0,
        batchSize: 2550,        // Crossover Batch Optimal
        contextLength: 8000,    // Production standard context
        kvToken: 2.0,
        moeGamma: 8.0,
        moeExperts: 8,
        moeLayers: 2,
        moeEfficiency: 30
    },
    'moe-collapse': {
        flops: 2250,
        bandwidth: 8.0,
        totalParams: 671,
        activeParams: 37,
        precision: 1.0,
        batchSize: 128,
        contextLength: 200000,
        kvToken: 2.0,
        moeGamma: 16.0,         // Scale-out bottleneck 16x slower
        moeExperts: 4,          // 4 active experts
        moeLayers: 1,           // fine-grained pipelining (1 layer per stage)
        moeEfficiency: 48       // 48% efficiency
    },
    'moe-optimized': {
        flops: 2250,
        bandwidth: 8.0,
        totalParams: 671,
        activeParams: 37,
        precision: 1.0,
        batchSize: 128,
        contextLength: 200000,
        kvToken: 2.0,
        moeGamma: 4.0,          // optimized scale-out only 4x slower
        moeExperts: 2,          // fewer active experts per step
        moeLayers: 6,           // coarse-grained pipelining (6 layers per stage)
        moeEfficiency: 60       // 60% network efficiency
    }
};

// 2. DOM Elements Selection
const elements = {
    // Inputs (Sliders & Numbers)
    gpuFlops: document.getElementById('gpu-flops'),
    numGpuFlops: document.getElementById('num-gpu-flops'),
    gpuBandwidth: document.getElementById('gpu-bandwidth'),
    numGpuBandwidth: document.getElementById('num-gpu-bandwidth'),
    totalParams: document.getElementById('total-params'),
    numTotalParams: document.getElementById('num-total-params'),
    activeParams: document.getElementById('active-params'),
    numActiveParams: document.getElementById('num-active-params'),
    precision: document.getElementById('precision'),
    numPrecision: document.getElementById('num-precision'),
    batchSize: document.getElementById('batch-size'),
    numBatchSize: document.getElementById('num-batch-size'),
    contextLength: document.getElementById('context-length'),
    numContextLength: document.getElementById('num-context-length'),
    kvToken: document.getElementById('kv-token'),
    numKvToken: document.getElementById('num-kv-token'),
    promptCache: document.getElementById('prompt-cache'),
    numPromptCache: document.getElementById('num-prompt-cache'),
    moeGamma: document.getElementById('moe-gamma'),
    numMoeGamma: document.getElementById('num-moe-gamma'),
    moeExperts: document.getElementById('moe-experts'),
    numMoeExperts: document.getElementById('num-moe-experts'),
    moeLayers: document.getElementById('moe-layers'),
    numMoeLayers: document.getElementById('num-moe-layers'),
    moeEfficiency: document.getElementById('moe-efficiency'),
    numMoeEfficiency: document.getElementById('num-moe-efficiency'),

    // Value Labels
    valGpuFlops: document.getElementById('val-gpu-flops'),
    valGpuBandwidth: document.getElementById('val-gpu-bandwidth'),
    valTotalParams: document.getElementById('val-total-params'),
    valActiveParams: document.getElementById('val-active-params'),
    valPrecision: document.getElementById('val-precision'),
    valBatchSize: document.getElementById('val-batch-size'),
    valContextLength: document.getElementById('val-context-length'),
    valKvToken: document.getElementById('val-kv-token'),
    valPromptCache: document.getElementById('val-prompt-cache'),
    valMoeGamma: document.getElementById('val-moe-gamma'),
    valMoeExperts: document.getElementById('val-moe-experts'),
    valMoeLayers: document.getElementById('val-moe-layers'),
    valMoeEfficiency: document.getElementById('val-moe-efficiency'),
    valClusterParallelism: document.getElementById('val-cluster-parallelism'),

    // Metrics Outputs
    metricTCompute: document.getElementById('metric-t-compute'),
    metricTMem: document.getElementById('metric-t-mem'),
    metricBOptimal: document.getElementById('metric-b-optimal'),
    metricTTFT: document.getElementById('metric-t-ttft'),
    bottleneckBanner: document.getElementById('bottleneck-banner'),
    bottleneckText: document.getElementById('bottleneck-text'),
    bottleneckRatio: document.getElementById('bottleneck-ratio'),
    commBanner: document.getElementById('comm-banner'),
    commText: document.getElementById('comm-text'),
    commRatio: document.getElementById('comm-ratio'),
    
    // Preset Area
    presetsContainer: document.getElementById('hardware-presets'),
    scenariosContainer: document.getElementById('scenario-presets'),
    
    // KV Cache Offload Elements
    retentionTime: document.getElementById('retention-time'),
    valRetentionTime: document.getElementById('val-retention-time'),
    retentionTimeDisplay: document.getElementById('retention-time-display'),
    optimalStrategyText: document.getElementById('optimal-strategy-text')
};

// 3. Global Chart Reference
let rooflineChart = null;

// 4. Bi-directional Synchronization setup
function setupInputsSync() {
    const inputPairs = [
        ['gpuFlops', 'numGpuFlops'],
        ['gpuBandwidth', 'numGpuBandwidth'],
        ['totalParams', 'numTotalParams'],
        ['activeParams', 'numActiveParams'],
        ['precision', 'numPrecision'],
        ['batchSize', 'numBatchSize'],
        ['contextLength', 'numContextLength'],
        ['kvToken', 'numKvToken'],
        ['promptCache', 'numPromptCache'],
        ['moeGamma', 'numMoeGamma'],
        ['moeExperts', 'numMoeExperts'],
        ['moeLayers', 'numMoeLayers'],
        ['moeEfficiency', 'numMoeEfficiency']
    ];

    inputPairs.forEach(([sliderId, numberId]) => {
        const slider = elements[sliderId];
        const number = elements[numberId];
        const label = elements['val' + sliderId.charAt(0).toUpperCase() + sliderId.slice(1)];

        // Sync Slider -> Number input & Label
        slider.addEventListener('input', (e) => {
            number.value = e.target.value;
            label.textContent = formatValue(sliderId, e.target.value);
            calculateMetrics();
        });

        // Sync Number input -> Slider & Label
        number.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val)) return;
            
            // Constrain
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            if (val < min) val = min;
            if (val > max) val = max;

            slider.value = val;
            label.textContent = formatValue(sliderId, val);
            calculateMetrics();
        });
    });

    // Special setup for Logarithmic Retention Time slider
    if (elements.retentionTime) {
        elements.retentionTime.addEventListener('input', (e) => {
            const level = parseInt(e.target.value);
            const textMap = {
                0: currentLang === 'zh' ? '1 秒' : '1 s',
                1: currentLang === 'zh' ? '10 秒' : '10 s',
                2: currentLang === 'zh' ? '1 分鐘' : '1 min',
                3: currentLang === 'zh' ? '5 分鐘' : '5 min',
                4: currentLang === 'zh' ? '1 小時' : '1 hr',
                5: currentLang === 'zh' ? '24 小時' : '24 hr'
            };
            const secondsMap = { 0: 1, 1: 10, 2: 60, 3: 300, 4: 3600, 5: 86400 };
            
            elements.valRetentionTime.textContent = textMap[level];
            elements.retentionTimeDisplay.textContent = `${secondsMap[level]} s`;
            
            calculateMetrics();
        });
    }
}

// 5. Hard Core Mathematical Calculation Engine
function calculateMetrics() {
    // Dynamically cap activeParams max range and current value based on current totalParams
    const totalParamsVal = parseFloat(elements.totalParams.value);
    elements.activeParams.max = totalParamsVal.toString();
    elements.numActiveParams.max = totalParamsVal.toString();

    let activeParamsVal = parseFloat(elements.activeParams.value);
    if (activeParamsVal > totalParamsVal) {
        activeParamsVal = totalParamsVal;
        elements.activeParams.value = activeParamsVal;
        elements.numActiveParams.value = activeParamsVal;
        elements.valActiveParams.textContent = formatValue('activeParams', activeParamsVal);
    }

    // Read all values
    const flops = parseFloat(elements.gpuFlops.value) * 1e12; // TFLOPS -> FLOPS
    const bandwidth = parseFloat(elements.gpuBandwidth.value) * 1e12; // TB/s -> Bytes/s
    const totalParams = totalParamsVal * 1e9; // B -> Parameters
    const activeParams = activeParamsVal * 1e9; // B -> Parameters
    const precisionBytes = parseFloat(elements.precision.value); // Bytes
    const batchSize = parseInt(elements.batchSize.value);
    const contextLength = parseInt(elements.contextLength.value);
    const kvTokenBytes = parseFloat(elements.kvToken.value) * 1024; // KB -> Bytes
    const promptCacheHit = parseFloat(elements.promptCache.value) / 100.0; // 0% - 100% -> 0.0 - 1.0

    // Read MoE values
    const moeGamma = parseFloat(elements.moeGamma.value);
    const moeExperts = parseInt(elements.moeExperts.value);
    const moeLayers = parseInt(elements.moeLayers.value);
    const moeEfficiency = parseFloat(elements.moeEfficiency.value) / 100.0;

    // Estimate single GPU HBM capacity (GB) based on memory bandwidth to represent realistic hardware constraints
    let singleGpuHbmGB = 80;
    const bwTB = bandwidth / 1e12;
    if (bwTB >= 6.0) singleGpuHbmGB = 192;      // Blackwell class (HBM3e)
    else if (bwTB >= 3.0) singleGpuHbmGB = 96;  // Hopper class (HBM3)
    else if (bwTB >= 1.5) singleGpuHbmGB = 80;  // Ampere class (HBM2e)
    else singleGpuHbmGB = 32;                   // TPU class

    // 1. Model capacity constraint (Model weight + concurrent KV Cache must fit in HBM)
    const weightFetchBytes = totalParams * precisionBytes;
    const kvFetchBytes = batchSize * contextLength * kvTokenBytes;
    const totalMemoryNeededGB = (weightFetchBytes + kvFetchBytes) / 1e9;
    
    // Estimate minimum cluster size based on memory requirements
    let clusterParallelism = Math.ceil(totalMemoryNeededGB / singleGpuHbmGB);

    // Align to the nearest power of 2 (1, 2, 4, 8, 16...) representing typical NVLink/TP topology
    let pow2 = 1;
    while (pow2 < clusterParallelism) {
        pow2 *= 2;
    }
    clusterParallelism = pow2;

    // 2. Compute/Latency constraints: scale cluster size to keep latency reasonable for extremely long contexts
    if (contextLength > 500000) {
        clusterParallelism = Math.max(clusterParallelism, 8);
    } else if (contextLength > 100000) {
        clusterParallelism = Math.max(clusterParallelism, 4);
    } else if (contextLength > 32000) {
        clusterParallelism = Math.max(clusterParallelism, 2);
    }

    if (elements.valClusterParallelism) {
        const gpuText = currentLang === 'zh' ? '張 GPU' : 'GPUs';
        elements.valClusterParallelism.textContent = `${clusterParallelism} ${gpuText} (TP-${clusterParallelism})`;
    }

    const effectiveFlops = flops * clusterParallelism;
    const effectiveBandwidth = bandwidth * clusterParallelism;

    // A. Compute Time (Seconds per Decode Step across TP Cluster)
    // t_compute = (B * P_active * 2 FLOPs/param) / effectiveFlops
    const tCompute = (batchSize * activeParams * 2) / effectiveFlops;

    // B. Memory Time (Seconds per Decode Step across TP Cluster)
    // t_mem = (P_total * Precision + B * L * KV_size) / effectiveBandwidth
    const tMem = (weightFetchBytes + kvFetchBytes) / effectiveBandwidth;

    // C. Crossover Batch Size (Weights Balance Point)
    // B_optimal = (FLOPs / Bandwidth) * (P_total / P_active) * (Precision / 2)
    const bOptimal = (effectiveFlops / effectiveBandwidth) * (totalParams / activeParams) * (precisionBytes / 2);

    // E. Time to First Token (TTFT) / Prefill Latency calculation
    // TTFT is experienced by a single user request (Prefill Batch Size = 1).
    // In production, to load large models and ensure acceptable latency, we always deploy on a parallel GPU cluster (Tensor Parallelism).
    const prefillBatchSize = 1;

    const prefillFlops = prefillBatchSize * contextLength * activeParams * 2;
    const tPrefillCompute = prefillFlops / effectiveFlops;
    
    const prefillWeightBytes = totalParams * precisionBytes;
    const prefillKVBytes = prefillBatchSize * contextLength * kvTokenBytes;
    const tPrefillMem = (prefillWeightBytes + prefillKVBytes) / effectiveBandwidth;
    const tPrefillNormal = Math.max(tPrefillCompute, tPrefillMem);

    // If cache hits, we only load the KV Cache of the single request.
    const tPrefillCachedOnly = prefillKVBytes / effectiveBandwidth;
    const tTTFT = (1.0 - promptCacheHit) * tPrefillNormal + promptCacheHit * tPrefillCachedOnly;
    const savedPercent = tPrefillNormal > 0 ? (1.0 - tTTFT / tPrefillNormal) * 100 : 0;

    // Update Dashboard Metrics Cards
    elements.metricTCompute.innerHTML = `${(tCompute * 1000).toFixed(2)} <span class="metric-unit">ms</span>`;
    elements.metricTMem.innerHTML = `${(tMem * 1000).toFixed(2)} <span class="metric-unit">ms</span>`;
    elements.metricBOptimal.innerHTML = `${Math.round(bOptimal)} <span class="metric-unit">seqs</span>`;

    if (savedPercent > 0.1) {
        elements.metricTTFT.innerHTML = `${(tTTFT * 1000).toFixed(1)} <span class="metric-unit">ms</span> <span style="font-size: 0.75rem; color: var(--color-memory); font-weight: 700;">(-${savedPercent.toFixed(0)}%)</span>`;
    } else {
        elements.metricTTFT.innerHTML = `${(tTTFT * 1000).toFixed(1)} <span class="metric-unit">ms</span>`;
    }

    // Dynamic Alert Banner Update
    const weightFetchTime = weightFetchBytes / effectiveBandwidth;
    const kvFetchTime = kvFetchBytes / effectiveBandwidth;
    const memoryTotalTime = weightFetchTime + kvFetchTime;
    
    if (tCompute > tMem) {
        elements.bottleneckBanner.className = 'glass-panel bottleneck-banner compute-bound';
        elements.bottleneckText.textContent = t('compute_bound');
        const utilization = (tMem / tCompute) * 100;
        elements.bottleneckRatio.textContent = t('mem_load_percent', { percent: utilization.toFixed(1) });
    } else {
        elements.bottleneckBanner.className = 'glass-panel bottleneck-banner memory-bound';
        elements.bottleneckText.textContent = t('memory_bound');
        const weightPercent = (weightFetchTime / memoryTotalTime) * 100;
        elements.bottleneckRatio.textContent = `${t('weight_fetch_percent', { percent: weightPercent.toFixed(1) })} | ${t('kv_fetch_percent', { percent: (100 - weightPercent).toFixed(1) })}`;
    }

    // D. MoE Rack Communication Bottleneck Calculation
    // R = (1 / gamma) * (2 * E_active * N_layer * eta)
    const isDense = activeParams === totalParams;
    let commRatio;
    if (isDense) {
        commRatio = 999.0; // Dense models don't have EP routing bottlenecks, virtually infinite safe ratio
        elements.commRatio.textContent = t('dense_no_ep_comm');
        elements.commBanner.className = 'glass-panel bottleneck-banner compute-bound';
        elements.commText.textContent = t('dense_comm_safe');
    } else {
        commRatio = (1.0 / moeGamma) * (2.0 * moeExperts * moeLayers * moeEfficiency);
        const ratioSign = commRatio >= 1.0 ? '>=' : '<';
        elements.commRatio.textContent = t('t_scale_ratio', { ratio: `${commRatio.toFixed(2)} ${ratioSign} 1` });
        if (commRatio >= 1.0) {
            elements.commBanner.className = 'glass-panel bottleneck-banner compute-bound';
            elements.commText.textContent = t('comm_safe');
        } else {
            elements.commBanner.className = 'glass-panel bottleneck-banner comm-bottleneck';
            elements.commText.textContent = t('comm_bottleneck');
        }
    }

    // Automatically sync the Rack Topology UI (active preset buttons and SVG classes) with the physical moeGamma value.
    let detectedTopoMode = 'dual';
    if (moeGamma <= 1.1) {
        detectedTopoMode = 'single';
    } else if (moeGamma > 8.5) {
        detectedTopoMode = 'multi';
    } else {
        detectedTopoMode = 'dual';
    }

    const topoPresets = document.getElementById('topology-presets');
    const topoSvg = document.getElementById('topo-svg');
    if (topoPresets && topoSvg) {
        topoPresets.querySelectorAll('.preset-btn').forEach(btn => {
            if (btn.getAttribute('data-topo') === detectedTopoMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const archClass = isDense ? 'topo-arch-dense' : 'topo-arch-moe';
        const targetClass = `topo-svg topo-mode-${detectedTopoMode} ${archClass}`;
        if (topoSvg.getAttribute('class') !== targetClass) {
            topoSvg.setAttribute('class', targetClass);
        }
    }

    // Dynamic Updates for Rack Topology SVG Visualizer (Mode 2)
    const cable = document.getElementById('cross-rack-cable');
    const badgeBg = document.getElementById('topo-status-bg');
    const badgeText = document.getElementById('topo-status-text');
    if (cable && badgeBg && badgeText) {
        if (isDense) {
            cable.setAttribute('class', 'topo-link link-safe');
            badgeBg.setAttribute('class', 'status-badge-bg badge-safe');
            badgeText.textContent = t('topo_badge_dense_safe');
        } else if (commRatio >= 1.0) {
            cable.setAttribute('class', 'topo-link link-safe');
            badgeBg.setAttribute('class', 'status-badge-bg badge-safe');
            badgeText.textContent = t('topo_badge_safe');
        } else if (commRatio >= 0.5) {
            cable.setAttribute('class', 'topo-link link-warning');
            badgeBg.setAttribute('class', 'status-badge-bg badge-warning');
            badgeText.textContent = t('topo_badge_warn', { gamma: moeGamma.toFixed(1) });
        } else {
            cable.setAttribute('class', 'topo-link link-collapse');
            badgeBg.setAttribute('class', 'status-badge-bg badge-collapse');
            badgeText.textContent = t('topo_badge_collapse');
        }
    }

    // Dynamic Updates for Multi-Rack (Mode 3) Scale-out topology links and status badge
    const multiLinks = [
        document.getElementById('multi-link-a'),
        document.getElementById('multi-link-b'),
        document.getElementById('multi-link-c'),
        document.getElementById('multi-link-d')
    ];
    const multiBadgeBg = document.getElementById('topo-multi-badge-bg');
    const multiBadgeTxt = document.getElementById('topo-multi-badge-txt');
    
    if (multiLinks[0] && multiBadgeBg && multiBadgeTxt) {
        let statusClass = 'link-collapse';
        let badgeClass = 'badge-collapse';
        let badgeVal = t('topo_badge_multi_status');
        
        if (isDense) {
            statusClass = 'link-safe';
            badgeClass = 'badge-safe';
            badgeVal = t('topo_badge_dense_safe');
        } else if (commRatio >= 1.0) {
            statusClass = 'link-safe';
            badgeClass = 'badge-safe';
            badgeVal = t('topo_badge_safe');
        } else if (commRatio >= 0.5) {
            statusClass = 'link-warning';
            badgeClass = 'badge-warning';
            badgeVal = t('topo_badge_warn', { gamma: moeGamma.toFixed(1) });
        } else {
            statusClass = 'link-collapse';
            badgeClass = 'badge-collapse';
            badgeVal = t('topo_badge_multi_status');
        }

        multiLinks.forEach(link => {
            if (link) link.setAttribute('class', `topo-multi-link ${statusClass}`);
        });
        multiBadgeBg.setAttribute('class', `status-badge-bg ${badgeClass}`);
        multiBadgeTxt.textContent = badgeVal;
    }

    // Dynamic Updates for TOR SWITCH rect & text based on cross-rack communication safety
    const torSwitch = document.getElementById('topo-switch-rect');
    const torSwitchTitle = document.getElementById('topo-switch-title');
    if (torSwitch && torSwitchTitle) {
        if (isDense) {
            torSwitch.setAttribute('class', 'switch-safe');
            torSwitchTitle.setAttribute('fill', '#06b6d4');
        } else if (commRatio >= 1.0) {
            torSwitch.setAttribute('class', 'switch-safe');
            torSwitchTitle.setAttribute('fill', '#06b6d4');
        } else if (commRatio >= 0.5) {
            torSwitch.setAttribute('class', 'switch-warning');
            torSwitchTitle.setAttribute('fill', '#f59e0b');
        } else {
            torSwitch.setAttribute('class', 'switch-collapse');
            torSwitchTitle.setAttribute('fill', '#ef4444');
        }
    }

    // Refresh Roofline Interactive Chart
    updateRooflineChart(effectiveFlops, effectiveBandwidth, totalParams, activeParams, precisionBytes, contextLength, kvTokenBytes, batchSize);

    // Calculate KV Cache Offload Storage Economics
    calculateOffloadEconomics(effectiveFlops, effectiveBandwidth, clusterParallelism, singleGpuHbmGB);
}

// 5.5. First-Principles KV Cache Multi-Tier Storage Opportunity Cost Calculator
function calculateOffloadEconomics(effectiveFlops, effectiveBandwidth, clusterParallelism, singleGpuHbmGB) {
    if (!elements.retentionTime) return;

    // A. Read input values
    const batchSize = parseInt(elements.batchSize.value);
    const contextLength = parseInt(elements.contextLength.value);
    const kvTokenBytes = parseFloat(elements.kvToken.value) * 1024; // KB -> Bytes
    const activeParams = parseFloat(elements.activeParams.value) * 1e9; // B -> Parameters
    const retentionLevel = parseInt(elements.retentionTime.value);

    // B. Calculate retention time (seconds)
    const secondsMap = { 0: 1, 1: 10, 2: 60, 3: 300, 4: 3600, 5: 86400 };
    const tHold = secondsMap[retentionLevel];

    // C. Calculate KV Cache Total Size
    const mKV = batchSize * contextLength * kvTokenBytes; // Bytes

    // D. Anchor baseline: Single GPU rental is $2.0/hr = $0.000556/sec. Total cluster rental scales:
    const gpuPriceSec = 0.000556;
    const clusterPriceSec = clusterParallelism * gpuPriceSec;

    // E. Storage specifications & rentals
    const hbmCapacity = clusterParallelism * singleGpuHbmGB * 1e9; // Bytes
    
    // Hold prices (opportunity cost of holding 1 Byte for 1 Second in USD)
    // HBM hold cost = cluster GPU cost / total capacity
    const pHbmHold = clusterPriceSec / hbmCapacity; 
    
    // DDR (Host RAM): Capacity 512GB, Bandwidth 100GB/s, Rent $0.2/hr = 5.56e-5/sec
    const ddrCapacity = 512 * 1e9;
    const ddrBandwidth = 100 * 1e9;
    const pDdrHold = 5.56e-5 / ddrCapacity;

    // Flash/SSD: Capacity 4TB, Bandwidth 6GB/s, Rent $0.02/hr = 5.56e-6/sec
    const ssdCapacity = 4096 * 1e9;
    const ssdBandwidth = 6 * 1e9;
    const pSsdHold = 5.56e-6 / ssdCapacity;

    // HDD (Spinning Disk): Capacity 16TB, Bandwidth 200MB/s, Rent $0.002/hr = 5.56e-7/sec
    const hddCapacity = 16384 * 1e9;
    const hddBandwidth = 200 * 1e6;
    const pHddHold = 5.56e-7 / hddCapacity;

    // F. Calculate costs for each strategy
    // 1. Rematerialization (Recompute)
    const tRemat = (2 * batchSize * contextLength * activeParams) / effectiveFlops;
    const costRemat = tRemat * clusterPriceSec;

    // Helper to calculate offload costs
    function getOffloadCost(capacity, bandwidth, pHold, name) {
        if (mKV > capacity) return Infinity; // Overflow
        const tRetrieve = mKV / bandwidth;
        const costRetrieve = tRetrieve * clusterPriceSec;
        const costHold = mKV * pHold * tHold;
        return {
            total: costRetrieve + costHold,
            retrieve: costRetrieve,
            hold: costHold,
            tRetrieve: tRetrieve
        };
    }

    // 2. Keep in HBM
    let costHbm = Infinity;
    if (mKV <= hbmCapacity) {
        const costHold = mKV * pHbmHold * tHold;
        costHbm = costHold; // Retrieve is 0
    }

    // 3. DDR Host Offload
    const ddr = getOffloadCost(ddrCapacity, ddrBandwidth, pDdrHold, 'DDR');
    
    // 4. Flash/SSD Offload
    const ssd = getOffloadCost(ssdCapacity, ssdBandwidth, pSsdHold, 'SSD');

    // 5. HDD Offload
    const hdd = getOffloadCost(hddCapacity, hddBandwidth, pHddHold, 'HDD');

    const costDdr = typeof ddr === 'object' ? ddr.total : Infinity;
    const costSsd = typeof ssd === 'object' ? ssd.total : Infinity;
    const costHdd = typeof hdd === 'object' ? hdd.total : Infinity;

    // G. Determine the optimal decision
    const options = [
        { key: 'remat', cost: costRemat, name: t('strategy_recompute') },
        { key: 'hbm', cost: costHbm, name: t('strategy_hbm') },
        { key: 'ddr', cost: costDdr, name: t('strategy_ddr') },
        { key: 'ssd', cost: costSsd, name: t('strategy_ssd') },
        { key: 'hdd', cost: costHdd, name: t('strategy_hdd') }
    ];

    let optimal = options[0];
    options.forEach(opt => {
        if (opt.cost < optimal.cost) {
            optimal = opt;
        }
    });

    // Update optimal strategy badge i18n text
    elements.optimalStrategyText.textContent = optimal.name;

    // H. Normalize and render CSS cost bars (Maximum cost determines 100% width)
    const validCosts = options.map(o => o.cost).filter(c => c !== Infinity && !isNaN(c));
    const maxValidCost = Math.max(...validCosts, 1e-9);

    // Render each option
    options.forEach(opt => {
        const card = document.getElementById(`card-opt-${opt.key}`);
        const costValEl = document.getElementById(`cost-val-${opt.key}`);
        const barRet = document.getElementById(`bar-ret-${opt.key}`);
        const barHold = document.getElementById(`bar-hold-${opt.key}`);
        const detailsEl = document.getElementById(`details-${opt.key}`);

        if (!card) return;

        // Highlight optimal choice
        if (opt.key === optimal.key) {
            card.classList.add('active-best');
        } else {
            card.classList.remove('active-best');
        }

        if (opt.cost === Infinity) {
            costValEl.textContent = 'OVERFLOW';
            costValEl.style.color = 'var(--color-error)';
            barRet.style.width = '0%';
            barHold.style.width = '0%';
            detailsEl.textContent = t('storage_overflow');
        } else {
            costValEl.style.color = '';
            costValEl.textContent = `$${opt.cost.toFixed(5)}`;

            // Calculate percentage fills
            let retPercent = 0;
            let holdPercent = 0;

            if (opt.key === 'remat') {
                retPercent = (costRemat / maxValidCost) * 100;
                detailsEl.textContent = t('recompute_details', { time: (tRemat * 1000).toFixed(1) });
            } else {
                let details = null;
                if (opt.key === 'hbm') {
                    holdPercent = (costHbm / maxValidCost) * 100;
                    details = { retTime: '0.0', holdCost: (mKV * pHbmHold * 3600).toFixed(4) };
                } else if (opt.key === 'ddr') {
                    retPercent = (ddr.retrieve / maxValidCost) * 100;
                    holdPercent = (ddr.hold / maxValidCost) * 100;
                    details = { retTime: (ddr.tRetrieve * 1000).toFixed(1), holdCost: (mKV * pDdrHold * 3600).toFixed(4) };
                } else if (opt.key === 'ssd') {
                    retPercent = (ssd.retrieve / maxValidCost) * 100;
                    holdPercent = (ssd.hold / maxValidCost) * 100;
                    details = { retTime: (ssd.tRetrieve * 1000).toFixed(1), holdCost: (mKV * pSsdHold * 3600).toFixed(4) };
                } else if (opt.key === 'hdd') {
                    retPercent = (hdd.retrieve / maxValidCost) * 100;
                    holdPercent = (hdd.hold / maxValidCost) * 100;
                    details = { retTime: (hdd.tRetrieve * 1000).toFixed(1), holdCost: (mKV * pHddHold * 3600).toFixed(4) };
                }
                
                detailsEl.textContent = t('storage_details', details);
            }

            barRet.style.width = `${retPercent.toFixed(1)}%`;
            barHold.style.width = `${holdPercent.toFixed(1)}%`;
        }
    });
}

// 6. Chart.js Diagram Renderer
function initRooflineChart() {
    const ctx = document.getElementById('rooflineChart').getContext('2d');
    
    rooflineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Will be filled dynamically (Batch sizes)
            datasets: [
                {
                    label: t('chart_compute_limit'),
                    data: [],
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    borderDash: [5, 5]
                },
                {
                    label: t('chart_weight_fetch'),
                    data: [],
                    borderColor: '#10b981',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    borderDash: [3, 3]
                },
                {
                    label: t('chart_kv_fetch'),
                    data: [],
                    borderColor: '#f59e0b',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    borderDash: [5, 5]
                },
                {
                    label: t('chart_actual_latency'),
                    data: [],
                    borderColor: '#8b5cf6',
                    borderWidth: 3.5,
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(139, 92, 246, 0.03)'
                },
                {
                    label: t('chart_current_batch'),
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: '#ef4444',
                    pointRadius: 7,
                    pointHoverRadius: 9,
                    showLine: false,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#9ca3af',
                        font: {
                            family: 'Outfit',
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.y.toFixed(2)} ms`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: t('label_batch_size'),
                        color: '#9ca3af',
                        font: {
                            family: 'Outfit',
                            weight: '600',
                            size: 13
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)'
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: t('chart_y_axis'),
                        color: '#9ca3af',
                        font: {
                            family: 'Outfit',
                            weight: '600',
                            size: 13
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)'
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

function updateRooflineChart(flops, bandwidth, totalParams, activeParams, precisionBytes, contextLength, kvTokenBytes, currentBatchSize) {
    if (!rooflineChart) return;

    const dataCompute = [];
    const dataWeights = [];
    const dataKV = [];
    const dataMax = [];
    const currentLoc = [];

    // Define X-axis resolution: create points from 1 to 4096. 
    // We use exponential steps to cover smaller batches with high details and larger batches smoothly.
    const steps = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 1536, 2048, 2560, 3072, 4096];
    
    // Add currentBatchSize if it's not already in steps to make sure it's accurately rendered
    if (!steps.includes(currentBatchSize)) {
        steps.push(currentBatchSize);
        steps.sort((a, b) => a - b);
    }

    steps.forEach(b => {
        // Compute time in ms: (2 * B * P_active) / FLOPS
        const tc = ((b * activeParams * 2) / flops) * 1000;
        
        // Weight Fetch time in ms (independent of B): (P_total * precision) / bandwidth
        const tw = ((totalParams * precisionBytes) / bandwidth) * 1000;
        
        // KV Cache Fetch time in ms (scales linearly with B): (B * L * KV_size) / bandwidth
        const tkv = ((b * contextLength * kvTokenBytes) / bandwidth) * 1000;
        
        // Memory Limit is the sum of weight fetch and KV cache fetch
        const tm = tw + tkv;
        const tMax = Math.max(tc, tm);

        dataCompute.push({ x: b, y: tc });
        dataWeights.push({ x: b, y: tw });
        dataKV.push({ x: b, y: tkv });
        dataMax.push({ x: b, y: tMax });

        if (b === currentBatchSize) {
            currentLoc.push({ x: b, y: tMax });
        }
    });

    // Load data to chart
    rooflineChart.data.datasets[0].data = dataCompute;
    rooflineChart.data.datasets[1].data = dataWeights;
    rooflineChart.data.datasets[2].data = dataKV;
    rooflineChart.data.datasets[3].data = dataMax;
    rooflineChart.data.datasets[4].data = currentLoc;

    // Update dynamic translations in case language changed
    rooflineChart.data.datasets[0].label = t('chart_compute_limit');
    rooflineChart.data.datasets[1].label = t('chart_weight_fetch');
    rooflineChart.data.datasets[2].label = t('chart_kv_fetch');
    rooflineChart.data.datasets[3].label = t('chart_actual_latency');
    rooflineChart.data.datasets[4].label = t('chart_current_batch');
    rooflineChart.options.scales.x.title.text = t('label_batch_size');
    rooflineChart.options.scales.y.title.text = t('chart_y_axis');

    // Redraw with animations
    rooflineChart.update('none'); // 'none' for instant fluid sliding during drag, standard update takes time
}

// 7. Hardware Preset Application
function applyPreset(presetKey) {
    const preset = hardwarePresets[presetKey];
    if (!preset) return;

    // Apply values to standard sliders/numbers
    const keys = [
        ['gpuFlops', 'numGpuFlops', 'valGpuFlops'],
        ['gpuBandwidth', 'numGpuBandwidth', 'valGpuBandwidth'],
        ['totalParams', 'numTotalParams', 'valTotalParams'],
        ['activeParams', 'numActiveParams', 'valActiveParams'],
        ['precision', 'numPrecision', 'valPrecision'],
        ['batchSize', 'numBatchSize', 'valBatchSize'],
        ['contextLength', 'numContextLength', 'valContextLength'],
        ['kvToken', 'numKvToken', 'valKvToken'],
        ['promptCache', 'numPromptCache', 'valPromptCache'],
        ['moeGamma', 'numMoeGamma', 'valMoeGamma'],
        ['moeExperts', 'numMoeExperts', 'valMoeExperts'],
        ['moeLayers', 'numMoeLayers', 'valMoeLayers'],
        ['moeEfficiency', 'numMoeEfficiency', 'valMoeEfficiency']
    ];

    // Pre-expand activeParams max before setting values so native <input type="range"> never clamps activeParams to an old smaller totalParams max
    if (preset.totalParams) {
        elements.activeParams.max = preset.totalParams.toString();
        elements.numActiveParams.max = preset.totalParams.toString();
    }

    keys.forEach(([sliderId, numberId, labelId]) => {
        let prop = sliderId;
        if (sliderId === 'gpuFlops') prop = 'flops';
        if (sliderId === 'gpuBandwidth') prop = 'bandwidth';
        const val = preset.hasOwnProperty(prop) ? preset[prop] : (preset.hasOwnProperty(sliderId) ? preset[sliderId] : 0);
        elements[sliderId].value = val;
        elements[numberId].value = val;
        elements[labelId].textContent = formatValue(sliderId, val);
    });

    calculateMetrics();
}

function setupPresetSelector() {
    elements.presetsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.preset-btn');
        if (!button) return;

        // Toggle active class
        elements.presetsContainer.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // De-active scenario presets to avoid confusion
        elements.scenariosContainer.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));

        // Apply preset
        const presetKey = button.getAttribute('data-preset');
        applyPreset(presetKey);
    });
}

// 7.5. Scenario Preset Application
function applyScenarioPreset(scenarioKey) {
    const preset = scenarioPresets[scenarioKey];
    if (!preset) return;

    const keys = [
        ['gpuFlops', 'numGpuFlops', 'valGpuFlops'],
        ['gpuBandwidth', 'numGpuBandwidth', 'valGpuBandwidth'],
        ['totalParams', 'numTotalParams', 'valTotalParams'],
        ['activeParams', 'numActiveParams', 'valActiveParams'],
        ['precision', 'numPrecision', 'valPrecision'],
        ['batchSize', 'numBatchSize', 'valBatchSize'],
        ['contextLength', 'numContextLength', 'valContextLength'],
        ['kvToken', 'numKvToken', 'valKvToken'],
        ['promptCache', 'numPromptCache', 'valPromptCache'],
        ['moeGamma', 'numMoeGamma', 'valMoeGamma'],
        ['moeExperts', 'numMoeExperts', 'valMoeExperts'],
        ['moeLayers', 'numMoeLayers', 'valMoeLayers'],
        ['moeEfficiency', 'numMoeEfficiency', 'valMoeEfficiency']
    ];

    // Pre-expand activeParams max before setting values so native <input type="range"> never clamps activeParams to an old smaller totalParams max
    if (preset.totalParams) {
        elements.activeParams.max = preset.totalParams.toString();
        elements.numActiveParams.max = preset.totalParams.toString();
    }

    keys.forEach(([sliderId, numberId, labelId]) => {
        let prop = sliderId;
        if (sliderId === 'gpuFlops') prop = 'flops';
        if (sliderId === 'gpuBandwidth') prop = 'bandwidth';
        const val = preset.hasOwnProperty(sliderId) ? preset[sliderId] : (preset.hasOwnProperty(prop) ? preset[prop] : 0);
        elements[sliderId].value = val;
        elements[numberId].value = val;
        elements[labelId].textContent = formatValue(sliderId, val);
    });

    calculateMetrics();
}

function setupScenarioSelector() {
    elements.scenariosContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.preset-btn');
        if (!button) return;

        // Toggle active class
        elements.scenariosContainer.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Toggle hardware presets to reflect Blackwell since scenarios are based on Blackwell
        elements.presetsContainer.querySelectorAll('.preset-btn').forEach(btn => {
            if(btn.getAttribute('data-preset') === 'blackwell') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Apply scenario preset
        const scenarioKey = button.getAttribute('data-scenario');
        applyScenarioPreset(scenarioKey);
    });
}

function setupTopologySelector() {
    const topoPresets = document.getElementById('topology-presets');
    const topoSvg = document.getElementById('topo-svg');
    if (!topoPresets || !topoSvg) return;

    topoPresets.addEventListener('click', (e) => {
        const button = e.target.closest('.preset-btn');
        if (!button) return;

        // Toggle active class
        topoPresets.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Apply topology mode to SVG
        const topoMode = button.getAttribute('data-topo');
        topoSvg.setAttribute('class', `topo-svg topo-mode-${topoMode}`);

        // Dynamic Physical Synced Logic (gamma value change based on deployment topology)
        let targetGamma = 8.0;
        if (topoMode === 'single') {
            targetGamma = 1.0; // All GPU inside single rack via high-speed NVLink backplane, gamma is 1.0 (no extra-rack latency degradation)
        } else if (topoMode === 'dual') {
            targetGamma = 8.0; // Typical Hopper/Blackwell scale-out InfiniBand cluster degradation (8.0x slower)
        } else if (topoMode === 'multi') {
            targetGamma = 16.0; // Extreme scale-out Ethernet cluster distributed across multiple racks (16.0x slower)
        }

        // Apply parameter value to DOM input controls
        elements.moeGamma.value = targetGamma;
        elements.numMoeGamma.value = targetGamma;
        elements.valMoeGamma.textContent = formatValue('moeGamma', targetGamma);

        // Recalculate physical metrics and re-draw Roofline
        calculateMetrics();
    });
}

// i18n Language Selector Functions
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Update active class on buttons
    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
        langSelector.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';

    // Update document title
    document.title = t('document_title');

    // Update static translated texts
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t(key);
        if (text && text !== key) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });

    // Update elements with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const text = t(key);
        if (text && text !== key) {
            el.title = text;
        }
    });

    // Update elements with data-i18n-aria
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const text = t(key);
        if (text && text !== key) {
            el.setAttribute('aria-label', text);
        }
    });

    // Update chatbot input placeholder
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.placeholder = t('chat_placeholder');
    }

    // Update suggestion chips
    const suggestionsContainer = document.getElementById('chat-suggestions');
    if (suggestionsContainer) {
        const chips = suggestionsContainer.querySelectorAll('.suggestion-chip');
        if (chips.length >= 3) {
            chips[0].textContent = t('suggest_optimal');
            chips[1].textContent = t('suggest_moe');
            chips[2].textContent = t('suggest_long');
        }
    }

    // Update sliders and number values formatted display
    const inputsToSync = [
        ['gpuFlops', 'valGpuFlops'],
        ['gpuBandwidth', 'valGpuBandwidth'],
        ['totalParams', 'valTotalParams'],
        ['activeParams', 'valActiveParams'],
        ['precision', 'valPrecision'],
        ['batchSize', 'valBatchSize'],
        ['contextLength', 'valContextLength'],
        ['kvToken', 'valKvToken'],
        ['moeGamma', 'valMoeGamma'],
        ['moeExperts', 'valMoeExperts'],
        ['moeLayers', 'valMoeLayers'],
        ['moeEfficiency', 'valMoeEfficiency']
    ];
    inputsToSync.forEach(([sliderId, labelId]) => {
        const slider = elements[sliderId];
        const label = elements[labelId];
        if (slider && label) {
            label.textContent = formatValue(sliderId, slider.value);
        }
    });

    // Dynamically trigger retentionTime label update based on new language
    if (elements.retentionTime) {
        elements.retentionTime.dispatchEvent(new Event('input'));
    }

    // Dynamically update chatbot system prompt instructions
    updateSystemPrompt();

    // Dynamically re-render welcome message if chatbot has just initialized (history is only system prompt)
    renderWelcomeMessage();

    // Re-run calculateMetrics to refresh dynamic calculations and chart text
    calculateMetrics();

    // Re-render inline & display math inside educational section after i18n innerHTML replacement
    initMathRenderer();
}

function updateSystemPrompt() {
    let langPrompt = "";
    if (currentLang === 'en') {
        langPrompt = "Always respond in English.";
    } else {
        langPrompt = "Always respond in Traditional Chinese (繁體中文). Do not use Simplified Chinese.";
    }
    
    // Replace system prompt instructions
    const updatedPrompt = reinerSystemPrompt.replace(
        /Always respond in Traditional Chinese \(繁體中文\)\. Do not use Simplified Chinese\./g,
        langPrompt
    ).replace(
        /Always respond in English\./g,
        langPrompt
    );
    
    if (chatbotHistory && chatbotHistory.length > 0 && chatbotHistory[0].role === 'system') {
        chatbotHistory[0].content = updatedPrompt;
    }
}

function renderWelcomeMessage() {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    if (chatbotHistory.length === 1) {
        chatBody.innerHTML = `
            <div class="chat-message ai-message">
                <p>${t('chat_welcome_1')}</p>
                <p>${t('chat_welcome_2')}</p>
                <p>${t('chat_welcome_3')}</p>
                <p>${t('chat_demo_notice')}</p>
            </div>
        `;
    }
}

// 8. KaTeX Auto-Renderer Initialization
function initMathRenderer() {
    const eduSection = document.querySelector('.edu-section');
    if (typeof renderMathInElement === 'function' && eduSection) {
        renderMathInElement(eduSection, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    } else if (window.katex) {
        // Fallback manual render for math blocks if auto-render deferred too long
        document.querySelectorAll('.formula-display').forEach(el => {
            const rawMath = el.getAttribute('data-raw-math') || el.textContent.trim().replace(/^\$\$|\$\$$/g, '');
            el.setAttribute('data-raw-math', rawMath);
            window.katex.render(rawMath, el, { displayMode: true, throwOnError: false });
        });
    }
}

// 9. Initial Entry Point
window.addEventListener('DOMContentLoaded', () => {
    setupInputsSync();
    setupPresetSelector();
    setupScenarioSelector();
    setupTopologySelector();
    
    // Bind Language selector buttons
    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
        langSelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (!btn) return;
            const selectedLang = btn.getAttribute('data-lang');
            switchLanguage(selectedLang);
        });
    }

    initRooflineChart();
    
    // Initialize the Reiner chatbot expert assistant
    initChatbot();

    // Initial Calculation with default Blackwell High Throughput Scenario & i18n Applied
    applyScenarioPreset('high-throughput');
    switchLanguage(currentLang);

    // Wait slightly to ensure KaTeX resources are fully parsed
    setTimeout(() => {
        initMathRenderer();
    }, 100);
});

/* ==========================================================================
   REINER EXPERT CHATBOT & WEB DYNAMIC SETTING ENGINE
   ========================================================================== */

// 1. Reiner Pope System Prompt - First Principles Architecture Expert
const reinerSystemPrompt = `You are "小Z" (Little Z), a world-class LLM Infra Expert who loves solving hard-core hardware engineering, memory bandwidth bottlenecks, and offloading economics. You are conducting a highly technical, first-principles Blackboard Lecture with a peer LLM infra expert (USER).

# Personality & Style Guidelines:
1. Speak in a highly technical, rigorous, first-principles manner. Avoid fluff, filler, generic intros, or hand-waving explanations.
2. Be extremely TERSE (concise). Treat the USER as a peer expert. Get straight to the physics and mathematics.
3. Always respond in Traditional Chinese (繁體中文). Do not use Simplified Chinese.
4. Boldly write out LaTeX formulas (use $$...$$ for display math and $...$ for inline math) whenever discussing quantitative physical relationships.

# Physics & Technical Knowledge Base:
1. Decoding Roofline & Latency:
   - Compute Bound Latency: t_compute = (2 * B * P_active) / F
   - HBM Memory Bandwidth Bound Latency: t_mem = (P_total * W + B * L * K) / BW
   - Step Latency: t_step = max(t_compute, t_mem)
   - Crossover Optimal Batch Size (no KV Cache): B_optimal = (F / BW) * (P_total / P_active) * (W / 2)
   - Note: In modern hardware (e.g., Blackwell/Hopper), the Compute/Bandwidth ratio (F/BW) is typically around 300.
2. MoE Rack-scale Communication Bottlenecks:
   - Intra-rack scale-up communication is extremely fast. Extra-rack scale-out communication suffers a severe bandwidth degradation factor (gamma, Nvidia default is 8x slower).
   - PP Cross-rack Communication Ratio: R = (1 / gamma) * (2 * E_active * N_layer * eta)
   - If R < 1, cross-rack communication becomes the primary bottleneck, causing severe pipeline bubbles. As Ilya Sutskever famously noted, "pipelining is not wise." Solutions involve coarse-grained PP (increasing N_layer per stage) or reducing gamma.
3. Reversible Networks (RevNets) & Feistel Cipher:
   - RevNets make the Transformer forward pass mathematically reversible: x_{i+1} = y_i + f(x_i), y_{i+1} = x_i.
   - Backward pass reconstructs activations on the fly without storing intermediate states in HBM, drastically saving memory. This is the conjugate of KV Cache: RevNets trade compute for memory; KV Cache trades memory for compute.
4. 100x Over-training & Budget Equality:
   - The general heuristic is equal compute budget for pretraining, RL, and inference: C_PT ~ C_RL ~ C_inf. Because the lifetime inference volume is huge, overtraining models by 100x beyond Chinchilla optimal is a highly rational choice to keep models small and squeeze down inference cost per token.
5. KV Cache Multi-Tier Storage & Offloading Economics:
   - Modern LLM API services leverage multi-tiered storage (HBM -> DDR Host -> NVMe SSD -> HDD) to optimize KV Cache holding costs during idle/retention times ($T_{\text{hold}}$).
   - Core trade-off: Recompute (Remat) vs. Keep (HBM) vs. Offload.
   - Keep in HBM cost: $C_{\text{HBM}} = M_{\text{kv}} \cdot p_{\text{HBM\_Hold}} \cdot T_{\text{hold}}$ (extremely expensive rent due to locking down premium HBM capacity).
   - Recompute (Rematerialization) cost: $C_{\text{Remat}} = T_{\text{remat}} \cdot \text{clusterPriceSec}$ where $T_{\text{remat}} = \frac{2 \cdot B \cdot L \cdot P_{\text{active}}}{\text{effectiveFlops}}$.
   - Offload cost: $C_{\text{Offload}} = M_{\text{kv}} \cdot p_{\text{storage\_Hold}} \cdot T_{\text{hold}} + \frac{M_{\text{kv}}}{\text{Bandwidth}_{\text{storage}}} \cdot \text{clusterPriceSec}$ (comprising storage rent and bandwidth retrieval penalty).
   - HBM is best for ultra-short idle times. DDR/SSD is optimal for typical minutes-level retention. Rematerialization is superior when retention exceeds hours, or when HBM/DDR capacity overflows.
6. Dense vs. MoE Architecture & Visual Animations:
   - Dense Model: defined strictly as P_active == P_total. Immune to EP All-to-All communication bottleneck because there is no expert routing. In the UI topology visualizer, a Dense model triggers a unified, synchronized cyan pulsing animation across all GPUs (representing lockstep TP/PP coordination).
   - MoE Model: defined as P_active < P_total. Suffers from EP All-to-All collective routing communication bottlenecks. Triggers a staggered, alternating purple pulsing animation across GPUs (representing sparse, asynchronous expert activation).
   - Dynamic Constraints: P_active is physically capped by P_total. If the user or you requests a parameter set where P_active > P_total, the frontend will automatically pull P_active down to equal P_total.
   - Top-1 Routing Misconception: Setting E_active = 1 is NOT equivalent to a Dense model. It is still an MoE model with P_active << P_total (HBM memory bandwidth bottleneck still reads P_total), and it still performs All-to-All routing communication across GPUs for batch size B > 1.
7. GPU HBM Capacity, Tensor Parallelism Cluster Sharding, and the Memory Wall Paradox:
   - GPU HBM baselines: Hopper/H100 = 96GB HBM, Blackwell = 192GB HBM, Ampere/A100 = 80GB HBM.
   - Cluster Parallelism (P) is automatically sharded to the nearest power of 2 of MemoryNeededGB / singleGpuHbmGB. This represents Tensor Parallelism (TP) sharding (e.g. TP-1, TP-2, TP-4, TP-8).
   - In the prefill phase (TTFT), the effective cluster specs scale by P (effectiveBandwidth = bandwidth * P, effectiveFlops = flops * P).
   - Memory Wall Prefill Paradox: Because modern GPU FLOPS/Bandwidth ratio is extremely high (~300), a dense FP16/BF16 model (2 Bytes) is mathematically Compute-bound in prefill for any prompt length L > 300 tokens (t_prefill_compute > t_prefill_mem).
   - Thus, for practical long prompts (e.g. L = 4000), TTFT is strictly Compute-bound, whereas Decode is Memory-bound. You can teach users to set L = 4000 and B = 50 to see an exact 1:6 serving throughput/cost ratio on a single card (TP-1) by accounting for these distinct bottlenecks.

# Web Parameter Sync & Smart Control Rules:
When the USER describes or asks to see a specific bottleneck or hardware scenario, you MUST actively append a JSON control block at the very end of your response to adjust the parameters:
1. Memory Bandwidth Bound Scenario:
   - Occurs with low batch sizes during decoding. You must set batchSize to a low value (e.g. 1, 8, 16) or apply the "fast-mode" preset.
   Example:
   \`\`\`json
   {
     "type": "control",
     "preset": "fast-mode"
   }
   \`\`\`
2. Compute Bound Scenario:
   - Occurs with high batch sizes. Set batchSize to a very large value (e.g. 3000) or apply "high-throughput" preset.
   Example:
   \`\`\`json
   {
     "type": "control",
     "preset": "high-throughput"
   }
   \`\`\`
3. General Parameter Adjustments:
   - Specify a preset (fast-mode, long-context, high-throughput, moe-collapse, moe-optimized, or hardware: blackwell, hopper, ampere, tpu) or individual key-value pairs inside "params" (batchSize, contextLength, gpuFlops, gpuBandwidth, totalParams, activeParams, precision, kvToken, moeGamma, moeExperts, moeLayers, moeEfficiency, retentionTime).
   - For retentionTime, valid values are integers 0 to 5: 0 (1s), 1 (10s), 2 (1 min), 3 (5 min), 4 (1 hr), 5 (24 hr).
   - If the USER asks about KV cache offloading or holding cost, adjust retentionTime to show how the optimal strategy shifts.

Append the JSON block at the absolute end of your message in a single \`\`\`json ... \`\`\` code block with NO extra text or explanations below it:
\`\`\`json
{
  "type": "control",
  "preset": "fast-mode",
  "params": {
    "batchSize": 8,
    "retentionTime": 3
  }
}
\`\`\`
The frontend will parse this JSON to automatically slide the knobs in real-time. Ensure correct JSON syntax.`;

// 2. Chatbot Configuration (User Defaults)
let chatbotConfig = {
    endpoint: localStorage.getItem('chat_api_endpoint') || '',
    apiKey: localStorage.getItem('chat_api_key') || '',
    model: localStorage.getItem('chat_api_model') || ''
};

// 3. Conversation Memory History
let chatbotHistory = [
    { role: 'system', content: reinerSystemPrompt }
];

// 4. Initialize Chatbot Component UI & Event Listeners
function initChatbot() {
    // DOM Elements Binding
    const chatTriggerBtn = document.getElementById('chat-trigger-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatSettingsBtn = document.getElementById('chat-settings-btn');
    const chatSettingsPanel = document.getElementById('chat-settings-panel');
    const chatApiEndpoint = document.getElementById('chat-api-endpoint');
    const chatApiKey = document.getElementById('chat-api-key');
    const chatApiModel = document.getElementById('chat-api-model');
    const chatSettingsSaveBtn = document.getElementById('chat-settings-save-btn');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatSuggestions = document.getElementById('chat-suggestions');
    const chatTriggerBadge = document.getElementById('chat-trigger-badge');

    if (!chatTriggerBtn || !chatWindow) return;

    // Load persisted configs into UI inputs
    if (chatApiEndpoint) chatApiEndpoint.value = chatbotConfig.endpoint;
    if (chatApiKey) chatApiKey.value = chatbotConfig.apiKey;
    if (chatApiModel) chatApiModel.value = chatbotConfig.model;

    // Toggle Chat Window
    chatTriggerBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatTriggerBadge.style.display = 'none';
            chatInput.focus();
            scrollToBottom();
        }
    });

    // Close Chat Window
    chatCloseBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Toggle Settings Panel
    chatSettingsBtn.addEventListener('click', () => {
        chatSettingsPanel.classList.toggle('collapsed');
    });

    // Save API Connection Settings
    chatSettingsSaveBtn.addEventListener('click', () => {
        const ep = chatApiEndpoint.value.trim();
        const key = chatApiKey.value.trim();
        const model = chatApiModel.value.trim();

        chatbotConfig.endpoint = ep;
        chatbotConfig.apiKey = key;
        chatbotConfig.model = model;

        localStorage.setItem('chat_api_endpoint', ep);
        localStorage.setItem('chat_api_key', key);
        localStorage.setItem('chat_api_model', model);

        chatSettingsPanel.classList.add('collapsed');
        
        // Show success visual indicator in AI bubble style
        const notifyDiv = document.createElement('div');
        notifyDiv.className = 'chat-message ai-message';
        notifyDiv.style.borderLeftColor = 'var(--color-memory)';
        notifyDiv.innerHTML = hasUserApiConfig()
            ? t('settings_success', { endpoint: chatbotConfig.endpoint, model: chatbotConfig.model })
            : t('settings_demo_active');
        chatBody.appendChild(notifyDiv);
        scrollToBottom();
    });

    // Auto-adjust Textarea Height based on typing lines
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = (chatInput.scrollHeight - 4) + 'px';
    });

    // Send Message trigger on click
    chatSendBtn.addEventListener('click', handleUserSendMessage);

    // Send Message trigger on Enter key (Shift+Enter to newline)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserSendMessage();
        }
    });

    // Suggestions Quick-select chips event binding
    chatSuggestions.addEventListener('click', (e) => {
        const chip = e.target.closest('.suggestion-chip');
        if (!chip) return;
        chatInput.value = chip.textContent;
        handleUserSendMessage();
    });

    // Scroll chat body to bottom
    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

function hasUserApiConfig() {
    return Boolean(
        chatbotConfig.endpoint &&
        chatbotConfig.apiKey &&
        chatbotConfig.model
    );
}

function buildDemoModeResponse(userText) {
    const normalized = userText.toLowerCase();
    const params = {};
    let preset = null;
    let explanation = t('demo_default_explain');

    const batchMatch = normalized.match(/batch(?:\s*size)?\D{0,12}(\d{1,5})/i);
    if (batchMatch) {
        params.batchSize = clampNumber(parseInt(batchMatch[1], 10), 1, 4096);
        explanation = `${t('demo_batch_explain')}\n\n${t('demo_control_hint')}`;
    }

    const contextMatch = normalized.match(/(?:context|上下文)\D{0,12}(\d{1,7})\s*(k|m|tokens?)?/i);
    if (contextMatch) {
        let contextValue = parseInt(contextMatch[1], 10);
        const unit = contextMatch[2];
        if (unit === 'k') contextValue *= 1000;
        if (unit === 'm') contextValue *= 1000000;
        params.contextLength = clampNumber(contextValue, 1000, 1000000);
        explanation = `${t('demo_kv_explain')}\n\n${t('demo_control_hint')}`;
    }

    if (includesAny(normalized, ['long context', 'long-context', 'context wall', '長上下文', '極長', '上下文牆'])) {
        preset = 'long-context';
        explanation = `${t('demo_kv_explain')}\n\n${t('demo_control_hint')}`;
    } else if (includesAny(normalized, ['moe collapse', 'rack collapse', 'cross-rack', '跨機架', '崩潰'])) {
        preset = 'moe-collapse';
        explanation = `${t('demo_moe_explain')}\n\n${t('demo_control_hint')}`;
    } else if (includesAny(normalized, ['moe optimized', 'comm optimized', 'pipelining', '優化'])) {
        preset = 'moe-optimized';
        explanation = `${t('demo_moe_explain')}\n\n${t('demo_control_hint')}`;
    } else if (includesAny(normalized, ['fast mode', 'low latency', '低延遲', '極速'])) {
        preset = 'fast-mode';
        explanation = `${t('demo_memory_explain')}\n\n${t('demo_control_hint')}`;
    } else if (includesAny(normalized, ['high throughput', 'throughput', '高吞吐'])) {
        preset = 'high-throughput';
        explanation = `${t('demo_batch_explain')}\n\n${t('demo_control_hint')}`;
    } else if (includesAny(normalized, ['kv cache', 'kv-cache', 'cache', '快取', '緩存'])) {
        explanation = t('demo_kv_explain');
    } else if (includesAny(normalized, ['moe', 'expert', 'all-to-all', '專家'])) {
        explanation = t('demo_moe_explain');
    } else if (includesAny(normalized, ['batch', '批次'])) {
        explanation = t('demo_batch_explain');
    } else if (includesAny(normalized, ['memory bound', 'memory-bound', 'bandwidth', '頻寬', '記憶體'])) {
        explanation = t('demo_memory_explain');
    }

    let controlBlock = '';
    if (preset || Object.keys(params).length > 0) {
        const controlData = { type: 'control' };
        if (preset) controlData.preset = preset;
        if (Object.keys(params).length > 0) controlData.params = params;
        controlBlock = `\n\n\`\`\`json\n${JSON.stringify(controlData, null, 2)}\n\`\`\``;
    }

    return `${t('demo_prefix')}${explanation}${controlBlock}`;
}

function includesAny(text, terms) {
    return terms.some(term => text.includes(term));
}

function clampNumber(value, min, max) {
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
}

// 5. Send Message Core flow
async function handleUserSendMessage() {
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    if (!chatInput) return;

    const userText = chatInput.value.trim();
    if (!userText) return;

    // Reset input box
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // 1. Append User Bubble to UI
    appendMessageHTML('user', escapeHTML(userText));
    scrollToBottom();

    // 2. Append User Message to history
    chatbotHistory.push({ role: 'user', content: userText });

    // 3. Create and append AI Typing Indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message typing-indicator-container';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;
    chatBody.appendChild(typingDiv);
    scrollToBottom();

    // 4. If user has not configured a full API connection, use free local Demo Mode.
    if (!hasUserApiConfig()) {
        window.setTimeout(() => {
            typingDiv.remove();
            const demoRawResponse = buildDemoModeResponse(userText);
            const cleanResponseText = parseAndExecuteAIControl(demoRawResponse);
            const messageDiv = appendMessageHTML('ai', parseMarkdown(cleanResponseText));
            renderMessageKaTeX(messageDiv);
            chatbotHistory.push({ role: 'assistant', content: demoRawResponse });
            scrollToBottom();
        }, 350);
        return;
    }

    // 5. Fire API Request to user Endpoint with Trailing-Slash handling and Stream support
    try {
        const cleanEndpoint = chatbotConfig.endpoint.replace(/\/+$/, '');
        const response = await fetch(`${cleanEndpoint}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${chatbotConfig.apiKey}`
            },
            body: JSON.stringify({
                model: chatbotConfig.model,
                messages: chatbotHistory,
                temperature: 0.1,
                stream: true // Enable streaming to avoid Cloudflare 524 timeouts
            })
        });

        // Remove Typing Indicator
        typingDiv.remove();

        if (!response.ok) {
            throw new Error(`API HTTP Error: ${response.status}`);
        }

        // Handle streaming response chunks
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let aiRawResponse = '';
        
        // 5. Create and append empty AI message bubble for streaming output
        const messageDiv = appendMessageHTML('ai', '');
        scrollToBottom();

        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep the last partial line in buffer

            for (const line of lines) {
                const cleanLine = line.trim();
                if (!cleanLine || cleanLine === 'data: [DONE]') continue;
                if (cleanLine.startsWith('data: ')) {
                    try {
                        const json = JSON.parse(cleanLine.slice(6));
                        const content = json.choices[0]?.delta?.content || '';
                        aiRawResponse += content;

                        // Periodically execute web actions and render markdown updates
                        const cleanResponseText = parseAndExecuteAIControl(aiRawResponse);
                        messageDiv.innerHTML = parseMarkdown(cleanResponseText);
                        scrollToBottom();
                    } catch (e) {
                        // Ignore JSON parsing errors for incomplete chunks
                    }
                }
            }
        }

        // 6. Complete remaining rendering, run MathJax/KaTeX math formatting
        const cleanResponseText = parseAndExecuteAIControl(aiRawResponse);
        messageDiv.innerHTML = parseMarkdown(cleanResponseText);
        renderMessageKaTeX(messageDiv);
        scrollToBottom();

        // 7. Append final complete response to history
        chatbotHistory.push({ role: 'assistant', content: aiRawResponse });

    } catch (error) {
        console.error('Chatbot API Connection Failure:', error);
        
        // Remove Typing Indicator
        typingDiv.remove();

        // Append connection error helpful message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message ai-message';
        errorDiv.style.borderLeftColor = 'var(--color-error)';
        errorDiv.innerHTML = `
            <p>${t('api_error_title')}</p>
            <p style="font-size: 12px; opacity: 0.85;">${t('api_error_desc')}</p>
            <p style="font-size: 12px; margin-top: 4px;">${t('api_error_check', { endpoint: chatbotConfig.endpoint })}</p>
        `;
        chatBody.appendChild(errorDiv);
        scrollToBottom();
    }
}

// 6. Simple HTML-safe message appender
function appendMessageHTML(sender, htmlContent) {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return null;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = htmlContent;
    chatBody.appendChild(messageDiv);
    return messageDiv;
}

// 7. Dynamic KaTeX Formatter inside specific message bubbles
function renderMessageKaTeX(messageDiv) {
    if (!messageDiv || !window.katex) return;

    messageDiv.querySelectorAll('.math-render-temp').forEach(el => {
        const math = el.getAttribute('data-math');
        const isDisplay = el.getAttribute('data-display') === 'true';
        try {
            window.katex.render(math, el, {
                displayMode: isDisplay,
                throwOnError: false
            });
            el.classList.remove('math-render-temp');
        } catch (err) {
            console.error('KaTeX rendering error inside bubble:', err);
            el.textContent = isDisplay ? `$$${math}$$` : `$${math}$`;
        }
    });
}

// 8. Dynamic AI Setting Web Parameters Engine (Parses JSON block)
function parseAndExecuteAIControl(responseText) {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    let match;
    let cleanText = responseText;

    // Show Tool Alerts Banner
    const chatToolAlert = document.getElementById('chat-tool-alert');
    const chatToolAlertText = document.getElementById('chat-tool-alert-text');

    while ((match = jsonRegex.exec(responseText)) !== null) {
        try {
            const controlData = JSON.parse(match[1].trim());
            
            if (controlData.type === 'control') {
                let toolActionsText = [];
                let activePreset = null;

                // 1. Process Preset Changes
                if (controlData.preset) {
                    const presetKey = controlData.preset.toLowerCase();
                    
                    // Attempt Hardwares preset
                    const hwBtn = elements.presetsContainer.querySelector(`[data-preset="${presetKey}"]`);
                    if (hwBtn) {
                        elements.presetsContainer.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
                        hwBtn.classList.add('active');
                        elements.scenariosContainer.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
                        applyPreset(presetKey);
                        toolActionsText.push(`硬體 Preset [${presetKey}]`);
                        activePreset = presetKey;
                    }

                    // Attempt Scenario preset
                    const scBtn = elements.scenariosContainer.querySelector(`[data-scenario="${presetKey}"]`);
                    if (scBtn) {
                        elements.scenariosContainer.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
                        scBtn.classList.add('active');
                        
                        elements.presetsContainer.querySelectorAll('.preset-btn').forEach(btn => {
                            if(btn.getAttribute('data-preset') === 'blackwell') {
                                btn.classList.add('active');
                            } else {
                                btn.classList.remove('active');
                            }
                        });
                        applyScenarioPreset(presetKey);
                        toolActionsText.push(`場景 Preset [${presetKey}]`);
                        activePreset = presetKey;
                    }
                }

                // 2. Process Individual Parameter Sliders Changes
                if (controlData.params) {
                    Object.entries(controlData.params).forEach(([paramName, val]) => {
                        // Semantic Protection Mechanism for MoE/Inference key scenarios
                        if (activePreset === 'moe-collapse' || activePreset === 'moe-optimized' || activePreset === 'fast-mode') {
                            const protectedParams = ['moeGamma', 'moeExperts', 'moeLayers', 'moeEfficiency'];
                            if (protectedParams.includes(paramName)) {
                                return; // Skip overriding to protect physics consistency
                            }
                        }

                        const slider = elements[paramName];
                        const number = elements['num' + paramName.charAt(0).toUpperCase() + paramName.slice(1)];
                        
                        if (slider) {
                            slider.value = val;
                            if (number) number.value = val;
                            
                            // Emulate input dispatch to trigger sync updates & roofline recalcs
                            slider.dispatchEvent(new Event('input'));
                            toolActionsText.push(`${paramName} 設為 ${val}`);
                        }
                    });
                }

                // Show action completion banner animation
                if (toolActionsText.length > 0 && chatToolAlert && chatToolAlertText) {
                    chatToolAlertText.innerHTML = t('ai_updating_params', { actions: toolActionsText.join(', ') });
                    chatToolAlert.classList.remove('hidden');
                    
                    // Auto fade out notification banner
                    setTimeout(() => {
                        chatToolAlert.classList.add('hidden');
                    }, 4000);
                }
            }
        } catch (jsonErr) {
            console.error('AI Control JSON parsing failed:', jsonErr);
        }
    }

    // Filter out the JSON block completely from displaying in user chat log bubble
    cleanText = cleanText.replace(/```json\s*[\s\S]*?\s*```/g, '').trim();
    return cleanText;
}

// 9. Markdown Parser to HTML with support for LaTeX Placeholders
function parseMarkdown(text) {
    const mathBlocks = [];
    let parsedText = text;

    // A. Keep KaTeX block $$ math $$ protected from markdown parsing
    parsedText = parsedText.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (match, math) => {
        const id = `__MATH_BLOCK_${mathBlocks.length}__`;
        mathBlocks.push({ id, math, display: true });
        return id;
    });

    // B. Keep KaTeX inline $ math $ protected
    parsedText = parsedText.replace(/\$\s*([^\$]+?)\s*\$/g, (match, math) => {
        const id = `__MATH_BLOCK_${mathBlocks.length}__`;
        mathBlocks.push({ id, math, display: false });
        return id;
    });

    // C. Markdown code blocks ```lang code ```
    parsedText = parsedText.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang}">${escapeHTML(code.trim())}</code></pre>`;
    });

    // D. Markdown Inline code `code`
    parsedText = parsedText.replace(/`([^`]+)`/g, (match, code) => {
        return `<code>${escapeHTML(code)}</code>`;
    });

    // E. Markdown Bold **text**
    parsedText = parsedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // F. Markdown Italic *text*
    parsedText = parsedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // G. Reiner pope specialized author quotation formatting:
    // "quote text" — Reiner Pope or 「quote text」 — Reiner Pope
    parsedText = parsedText.replace(/(「[^」]+」|“[^”]+”|"[^"]+")\s*—\s*Reiner Pope/g, '<div class="author-quote">$1 — Reiner Pope</div>');

    // H. Markdown Lists & Line breaks
    parsedText = parsedText.split('\n').map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
            return `<li>${trimmed.substring(2)}</li>`;
        }
        return trimmed ? `<p>${line}</p>` : '';
    }).join('\n');

    // Wrap list items in <ul> tags
    parsedText = parsedText.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    parsedText = parsedText.replace(/<\/ul>\s*<ul>/g, ''); // Join consecutive list blocks

    // I. Restore KaTeX math blocks placeholders as DOM temporary elements
    mathBlocks.forEach(item => {
        parsedText = parsedText.replace(item.id, `<span class="math-render-temp" data-math="${escapeHTML(item.math)}" data-display="${item.display}"></span>`);
    });

    return parsedText;
}

// 10. General HTML Escape Helper
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Scroll chat window body to bottom helper
function scrollToBottom() {
    const chatBody = document.getElementById('chat-body');
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
}
