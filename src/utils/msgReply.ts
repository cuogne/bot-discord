const listMsg = [
    'Ping cái con di me may',
    'Ping con cac',
    'Ping làm deo gì',
    'Ping gì ku ?',
    'Mày đừng có mà ping',
    'Mày thích ping không ?',
    'Ping tao thì mày gay',
    'Ping tao tao kick',
    'Ping cái dau buoi',
    'Ping cái loz gì',
    'Mày ping hoài làm cái gì',
    'Đừng có ping nữa',
    'Ping tao làm gì'
];

export const replyBot = () => {
    // const index = 3
    if (!listMsg || listMsg.length === 0) {
        return 'Xin chào';
    }
    const index = Math.floor(Math.random() * listMsg.length);
    const result = listMsg[index];
    return result;
}