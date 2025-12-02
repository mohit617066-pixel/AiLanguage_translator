async function translateText() {
    const text = document.getElementById("inputText").value.trim();
    const source = document.getElementById("sourceLang").value.trim();
    const target = document.getElementById("targetLang").value.trim();

    if (!text || !source || !target) {
        document.getElementById("outputBox").innerHTML = "⚠ Please fill all fields!";
        return;
    }

    // ✅ Use the API endpoint (NOT /docs)
    const apiUrl = "https://preobjective-slanderously-libby.ngrok-free.dev/translate";

    document.getElementById("outputBox").innerHTML = "⏳ Translating...";

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                source_lang: source,
                target_lang: target
            })
        });

        if (!res.ok) {
            document.getElementById("outputBox").innerHTML =
                `❌ Server Error: ${res.status} ${res.statusText} — check Colab/ngrok`;
            return;
        }

        const data = await res.json();
        document.getElementById("outputBox").innerHTML = data.translated_text ?? JSON.stringify(data);

    } catch (err) {
        console.error(err);
        document.getElementById("outputBox").innerHTML =
            "⚠ Network Error or CORS blocked (check console & server).";
    }
}
