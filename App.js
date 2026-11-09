import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';

export default function App() {
  const [search, setSearch] = useState('');
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // 1. Busca TODAS as gerações (1025 Pokémons no total)
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then((res) => res.json())
      .then((data) => {
        setAllPokemon(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar lista completa:', error);
        setLoading(false);
      });
  }, []);

  // 2. Filtro em tempo real (por nome ou ID)
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredPokemon([]);
    } else {
      const query = search.toLowerCase().trim();
      const results = allPokemon.filter((item, index) => {
        const pokemonId = (index + 1).toString();
        return item.name.toLowerCase().includes(query) || pokemonId === query;
      }).slice(0, 10); // Limita em 10 sugestões para performance limpa
      
      setFilteredPokemon(results);
    }
  }, [search, allPokemon]);

  // 3. Busca detalhes completos do Pokémon selecionado
  const fetchPokemonDetails = (nameOrId) => {
    setLoadingDetails(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedPokemon(data);
        setLoadingDetails(false);
        setSearch(''); // Limpa o campo para fechar o menu de sugestões
        setFilteredPokemon([]);
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes:', error);
        setLoadingDetails(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#EE1515" />
        <Text style={styles.loadingText}>Carregando Pokédex Nacional...</Text>
      </View>
    );
  }

  // Pega imagem oficial HD (fallback para o sprite padrão se não houver)
  const getPokemonImage = (pokemon) => {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>

      {/* Campo de Pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Buscar por nome ou nº (ex: rayquaza)..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {/* Lista de Sugestões de Auto-complete */}
      {filteredPokemon.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredPokemon}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.suggestionItem} 
                onPress={() => fetchPokemonDetails(item.name)}
              >
                <Text style={styles.suggestionText}>{item.name.toUpperCase()}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {/* Feedback de carregamento individual */}
      {loadingDetails && (
        <ActivityIndicator size="small" color="#EE1515" style={{ marginTop: 24 }} />
      )}

      {/* Card do Pokémon Selecionado */}
      {selectedPokemon && !loadingDetails && (
        <View style={styles.card}>
          <Text style={styles.pokemonId}>#{String(selectedPokemon.id).padStart(4, '0')}</Text>
          
          <Image
            source={{ uri: getPokemonImage(selectedPokemon) }}
            style={styles.image}
            resizeMode="contain"
          />
          
          <Text style={styles.name}>{selectedPokemon.name.toUpperCase()}</Text>
          
          <View style={styles.typesContainer}>
            {selectedPokemon.types.map((t) => (
              <View key={t.type.name} style={styles.typeBadge}>
                <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.info}>Altura: {selectedPokemon.height / 10} m</Text>
            <Text style={styles.info}>Peso: {selectedPokemon.weight / 10} kg</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  suggestionsContainer: {
    width: '100%',
    maxHeight: 180,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginTop: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 100,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  pokemonId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    alignSelf: 'flex-end',
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: '#333',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  typeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },
  info: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#444',
  },
});