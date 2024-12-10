import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteForm() {
    const [compte, setCompte] = useState({ solde: 0, dateCreation: '', type: 'COURANT' });
    const [error, setError] = useState('');
    const [comptes, setComptes] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchComptes();
    }, []);

    const fetchComptes = () => {
        axios.get(`${API_BASE_URL}/comptes`)
            .then((response) => setComptes(response.data))
            .catch((error) => console.error('Erreur lors de la récupération des comptes:', error));
    };

    const handleChange = (e) => {
        setCompte({ ...compte, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (compte.solde < 0) {
            setError('Le solde ne peut pas être négatif.');
            return;
        }
        if (!compte.dateCreation) {
            setError('La date de création est obligatoire.');
            return;
        }

        const request = editingId
            ? axios.put(`${API_BASE_URL}/comptes/${editingId}`, compte)
            : axios.post(`${API_BASE_URL}/comptes`, compte);

        request
            .then(() => {
                alert(editingId ? 'Compte modifié avec succès.' : 'Compte ajouté avec succès.');
                setCompte({ solde: 0, dateCreation: '', type: 'COURANT' });
                setEditingId(null);
                fetchComptes();
            })
            .catch((error) => {
                setError('Erreur lors de la soumission.');
                console.error(error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
            axios.delete(`${API_BASE_URL}/comptes/${id}`)
                .then(() => {
                    alert('Compte supprimé avec succès.');
                    fetchComptes();
                })
                .catch((error) => console.error('Erreur lors de la suppression du compte:', error));
        }
    };

    const handleEdit = (id) => {
        const compteToEdit = comptes.find((c) => c.id === id);
        setCompte({ ...compteToEdit });
        setEditingId(id);
    };

    return (
        <div className="container mt-4">
            <h2>{editingId ? 'Modifier un Compte' : 'Ajouter un Compte'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="solde">Solde</label>
                    <input
                        type="number"
                        name="solde"
                        className="form-control"
                        value={compte.solde}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="dateCreation">Date de Création</label>
                    <input
                        type="date"
                        name="dateCreation"
                        className="form-control"
                        value={compte.dateCreation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="type">Type</label>
                    <select
                        name="type"
                        className="form-select"
                        value={compte.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="COURANT">Courant</option>
                        <option value="EPARGNE">Épargne</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    {editingId ? 'Modifier' : 'Ajouter'}
                </button>
                {editingId && (
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                            setCompte({ solde: 0, dateCreation: '', type: 'COURANT' });
                            setEditingId(null);
                        }}
                    >
                        Annuler
                    </button>
                )}
            </form>

            <h2 className="mt-5">Liste des Comptes</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Solde</th>
                    <th>Date de Création</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {comptes.map((compte) => (
                    <tr key={compte.id}>
                        <td>{compte.id}</td>
                        <td>{compte.solde}</td>
                        <td>{compte.dateCreation}</td>
                        <td>{compte.type}</td>
                        <td>
                            <button
                                className="btn btn-primary me-2"
                                onClick={() => handleEdit(compte.id)}
                            >
                                Modifier
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleDelete(compte.id)}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CompteForm;
