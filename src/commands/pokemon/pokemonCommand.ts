import { ChatInputCommandInteraction } from 'discord.js';
import { TYPE_COLORS } from './types/color.type'
import { PokemonType, PokemonAbility, PokemonStat, FlavorTextEntry, PokemonSpecies, PokemonData} from './types/poke.type'

export async function pokemonCommand(interaction: ChatInputCommandInteraction){
    try {
        await interaction.deferReply();
        const inputId = interaction.options.getString('id');
        const name = interaction.options.getString('name');
        let pokeId: number | string;

        if (inputId && name) {
            await interaction.editReply({
                content: 'Vui lòng chỉ nhập ID hoặc tên, không được nhập cả hai!',
            });
            return;
        }

        if (inputId) {
            const parsedId = parseInt(inputId, 10);
            const checkRange1 = parsedId >= 1 && parsedId <= 1025;
            const checkRange2 = parsedId >= 10001 && parsedId <= 10277;

            if (checkRange1 || checkRange2) {
                pokeId = parsedId;
            } else {
                await interaction.editReply({
                    content: 'ID Pokémon không hợp lệ! Vui lòng nhập ID từ 1-1025 hoặc từ 10001-10277.',
                });
                return;
            }
        }
        else if (name) {
            pokeId = name.toLowerCase().trim();
        }
        else {
            const totalPokemon = 1025 + (10277 - 10000 + 1);
            const randomNumber = Math.floor(Math.random() * totalPokemon) + 1;

            pokeId = (randomNumber <= 1025) ? randomNumber : 10000 + (randomNumber - 1025);
        }

        // handle pokemon data
        const link = `https://pokeapi.co/api/v2/pokemon/${pokeId}/`
        const res = await fetch(link)
        const data: PokemonData = await res.json()

        const speciesRes = await fetch(data.species.url);
        const speciesData: PokemonSpecies = await speciesRes.json();

        const idPokemon = data.id || pokeId
        const pokeImg = data?.sprites?.other?.["official-artwork"]?.front_default
        const pokeName = data.name.charAt(0).toUpperCase() + data.name.slice(1)
        const pokeType = data.types.map((type: PokemonType) => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(", ")
        const primaryType = data.types[0].type.name as keyof typeof TYPE_COLORS;
        const embedColor = TYPE_COLORS[primaryType] || 0xAAAAAA;

        const pokeHeight = data.height / 10 // Convert decimetres to metres
        const pokeWeight = data.weight / 10 // Convert hectograms to kilograms
        
        const regularAbilities = data.abilities
            .filter((a: PokemonAbility) => !a.is_hidden)
            .map((ability: PokemonAbility) => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1))
            .join(", ");

        const hiddenAbility = data.abilities
            .filter((a: PokemonAbility) => a.is_hidden)
            .map((ability: PokemonAbility) => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1))
            .join("");
        
        const abilitiesField = regularAbilities + (hiddenAbility ? `\n*(Hidden: ${hiddenAbility})*` : '');
        
        const [hp, atk, def, satk, sdef, spd] = data.stats.map((stat: PokemonStat) => stat.base_stat);
        const totalStats = hp + atk + def + satk + sdef + spd;
        
        const statsField = 
            `**HP:** ${hp} | **Atk:** ${atk} | **Def:** ${def}\n` +
            `**Sp. Atk:** ${satk} | **Sp. Def:** ${sdef} | **Spd:** ${spd}\n` +
            `**Total:** **${totalStats}**`;

        const flavorTextEntry = speciesData.flavor_text_entries.find((entry: FlavorTextEntry) => entry.language.name === 'en' && entry.version.name === 'scarlet' || entry.language.name === 'en'); 
        const pokeDescription = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\n|\f/g, ' ') : "No Pokedex description available.";

        // display
        await interaction.editReply({
            embeds: [{
                color: embedColor,
                title: `✨ ${pokeName} (#${idPokemon})`,
                description: `*${pokeDescription}*`,
                thumbnail: { url: pokeImg ?? '' },
                // image: { url: pokeImg },

                fields: [
                    {
                        name: '📐 Attributes',
                        value: `**Type:** ${pokeType}\n**Height:** ${pokeHeight} m | **Weight:** ${pokeWeight} kg`,
                        inline: false, 
                    },
                    {
                        name: '🌟 Abilities',
                        value: abilitiesField,
                        inline: false,
                    },
                    {
                        name: '⚔️ Base Stats',
                        value: statsField,
                        inline: false,
                    },
                ],
                footer: {
                    text: 'Data provided by PokéAPI',
                },
            }]
        })

    }
    catch (error) {
        await interaction.editReply({
            content: 'Đã xảy ra lỗi khi truy vấn dữ liệu Pokémon. Vui lòng thử lại sau.'
        });
        console.error('Error in pokemonCommand:', error);
    }
}