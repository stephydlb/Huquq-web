import React from 'react';
import './Dashboard_new.css';

const Dashboard_new: React.FC = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Huququ'llah Assistant</h1>
        <p>Solde dû, prochain paiement, prix or actuel</p>
      </header>
      <section className="stats-cards">
        <div className="card">
          <h2>Solde dû</h2>
          <p>1234.56 €</p>
        </div>
        <div className="card">
          <h2>Prochain paiement</h2>
          <p>15 avril 2024</p>
        </div>
        <div className="card">
          <h2>Prix or actuel</h2>
          <p>55.12 €/g</p>
        </div>
      </section>
      <section className="quick-actions">
        <button>Ajouter revenu</button>
        <button>Ajouter dépense</button>
        <button>Planifier paiement</button>
      </section>
      <section className="transactions-list">
        <h3>Dernières transactions</h3>
        <ul>
          <li>Revenu: Salaire - 2000 €</li>
          <li>Dépense: Logement - 800 €</li>
          <li>Dépense: Nourriture - 300 €</li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard_new;
