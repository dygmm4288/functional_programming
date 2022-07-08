function addFriend(u1, u2) {
    if (u1.friends.indexOf(u2) == -1) {
        if (confirm('친구로 추가할까요')) {
            u1.friends.push(u2);
            alert('추가 되었습니다');
        }
    } else {
        alert('이미 친구입니다.');
    }
}

const pj = { name: 'PJ', friends: [] };
const ha = { name: 'HA', frineds: [] };

console.log(addFriends(pj, ha));
console.log(addFriends(pj, ha));

function addFriends2(u1, u2) {
    (u1.friends.indexOf(u2) == -1 || alert('이미 친구입니다.')) &&
        confirm('친구로 추가할까요?') &&
        u1.friends.push(u2) &&
        alert('추가 되었습니다.');
}
