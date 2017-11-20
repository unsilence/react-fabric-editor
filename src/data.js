let data = [];
"http://127.0.0.1:3000/public/img/101.png"
for (let index = 1; index < 70; index++) {
    if(index !== 2 && index !== 3)
    {
        data.push(`http://127.0.0.1:3000/public/img/${index}.png`);
    }
}

export default data;
