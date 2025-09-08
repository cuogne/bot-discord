const apis = {
    cat: 'https://api.thecatapi.com/v1/images/search',
    dog: 'https://api.thedogapi.com/v1/images/search',
}

async function getImage(interaction, link, animal){
    await interaction.deferReply();
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const imageUrl = data[0].url;

        const embed = {
            title: `${interaction.user.username} muốn xem ảnh ${animal}`,
            image: {
                url: imageUrl,
            },
        };
        await interaction.editReply({ embeds: [embed] });
    }
    catch (error) {
        console.error('Error fetching image:', error);
        await interaction.editReply({
            content: '❌ Đã có lỗi xảy ra khi lấy ảnh. Vui lòng thử lại sau.',
            flags: 64,
        });
    }
}

export async function getImageCommand(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand){
        case 'cat':
            await getImage(interaction, apis.cat, 'mèo');
            break;
        case 'dog':
            await getImage(interaction, apis.dog, 'chó');
            break;
        default:
            await interaction.reply({
                content: '❌ Subcommand không hợp lệ!',
                flags: 64
            });
    }
}