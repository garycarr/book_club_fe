export default {
    generateString : function (length) {
        let string = '';
        while (string.length < length) {
            string += 'a';
        }
        return string;
    }
};
