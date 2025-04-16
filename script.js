async function checkDNC() {
    const phone = document.getElementById("phoneNumber").value.trim();
    
    // صرف 10 ہندسوں والا نمبر قبول کریں
    if (!/^\d{10}$/.test(phone)) {
        document.getElementById("result").innerHTML = `
            <div class="error">
                <p>❌ غلط نمبر! براہ کرم 10 ہندسوں والا امریکی فون نمبر داخل کریں</p>
            </div>
        `;
        return;
    }

    // لوڈنگ کا پیغام
    document.getElementById("result").innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>${phone} کا ڈیٹا چیک کیا جا رہا ہے...</p>
        </div>
    `;

    try {
        const response = await fetch(`https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=${phone}`);
        
        if (!response.ok) {
            throw new Error(`API جواب نہیں دے رہی (Status: ${response.status})`);
        }

        const data = await response.json();
        
        // ڈیٹا کی جانچ پڑتال
        if (!data || typeof data !== 'object') {
            throw new Error("API سے غلط ڈیٹا موصول ہوا");
        }

        // نتائج کو خوبصورت طریقے سے ظاہر کریں
        document.getElementById("result").innerHTML = `
            <div class="result-card">
                <h3>📱 ${data.phone || phone}</h3>
                <div class="result-item ${data.status === 'ok' ? 'good' : 'bad'}">
                    <span>حالت:</span> ${data.status || 'نامعلوم'}
                </div>
                <div class="result-item ${data.listed ? 'bad' : 'good'}">
                    <span>بلیک لسٹ:</span> ${data.listed ? 'ہاں ⚠️' : 'نہیں ✅'}
                </div>
                <div class="result-item ${data.type ? 'bad' : 'good'}">
                    <span>لیٹیگیٹر:</span> ${data.type || 'نہیں ✅'}
                </div>
                <div class="result-item">
                    <span>ریاست:</span> ${data.state || 'نامعلوم'}
                </div>
                <div class="result-item ${data.dnc_national ? 'good' : 'neutral'}">
                    <span>قومی DNC:</span> ${data.dnc_national ? 'ہاں 🔕' : 'نہیں 📞'}
                </div>
                <div class="result-item ${data.dnc_state ? 'good' : 'neutral'}">
                    <span>ریاستی DNC:</span> ${data.dnc_state ? 'ہاں 🔕' : 'نہیں 📞'}
                </div>
            </div>
        `;

    } catch (error) {
        document.getElementById("result").innerHTML = `
            <div class="error">
                <p>⚠️ خرابی: ${error.message}</p>
                <p>براہ کرم کچھ دیر بعد دوبارہ کوشش کریں</p>
                <button onclick="checkDNC()">دوبارہ کوشش کریں</button>
            </div>
        `;
    }
}
