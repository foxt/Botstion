document.body.parentElement.style.overflow = "hidden";
document.scrollingElement.scrollTop = 0;
let ffsfsfsfsfsf = false;
function animation() {
    clearTimeout(timeoutAnimation);
    let ls = document.querySelector("#logo").style;
    let lis = document.querySelector("#logoIndent").style;
    ls.transition = "2s all";
    ls.width = "100vh";
    ls.left = "calc(50vw - 50vh)";
    ls.top = "0px";
    ls.backgroundPosition = "0% 0%";
    lis.height = "66.666vh";

    setTimeout(() => {
        ls.transition = "none";
        try { document.querySelector("#logoIndent").remove(); } catch (e) {}
        ls.background = "url(\"logo.svg\")";
        ls.backgroundSize = "100% 100%";
        ls.transition = "1s transform, 1s border-radius,1s top,1s width,1s height,1s left,1s top";
        ls.borderRadius = "2.5vh";
        setTimeout(() => {
            let goto = document.querySelector("#botstion-main-logo").getBoundingClientRect();
            let at = document.querySelector("#logo").getBoundingClientRect();
            let percent = goto.width / at.width;
            ls.borderRadius = "0.1em";
            ls.width = goto.width + "px";
            ls.height = goto.height + "px";
            ls.left = goto.x + "px";
            ls.top = goto.y + "px";
            setTimeout(() => {
                document.body.parentElement.style.overflowY = "scroll";
                document.querySelector("#logo").remove();
            }, 1000);
        }, 150);
    }, 2000);
}
function addpopup(url, elem) {
    document.getElementById(elem).classList.add("is-loading");
    let windows = window.open(url, "_blank", "width=400,height=430");
    let pollTimer = window.setInterval(() => {
        if (windows.closed !== false) {
            window.clearInterval(pollTimer);
            document.getElementById(elem).classList.remove("is-loading");
        }
    }, 200);
}

let timeoutAnimation = setTimeout(animation, 5000)

;(async () => {
    let gh = await (await fetch("https://api.github.com/repositories/107296088/stats/commit_activity")).json();
    let commits = 0;
    for (let week of gh) {
        commits += week.total;
    }
    document.getElementById("commits").innerHTML = commits;
})();

async function updateCounters() {
    let botstion = await (await fetch("/api/info")).json();
    document.querySelector("#servers").innerText = botstion.servers;
    document.querySelector("#users").innerText = botstion.members;
    animation();
}

updateCounters();


// fix for mobile safari thing where 100vh is 100% of the screen, not 100% of vp
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
window.addEventListener("resize", () => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.querySelector("#panel1").style.maxHeight = `${vh * 100}px`;
});
