// components/LeaderCard.js
import Image from "next/image";
export default function LeaderCard({ user, rank }) {
    return (
        <div className="leader-card">
            <div className="card-header">
                <div className="rank">#{rank}</div>
                <Image src={user.avatar || '/default-avatar.png'} alt="avatar" className="avatar" width={40} height={40} />

            </div>
            <div className="card-body">
                <h3 className="name">{user.name}</h3>
                <p className="bio">{user.bio || "No bio available."}</p>
                <div className="info">
                    <p><strong>Points:</strong> {user.points}</p>
                    <p><strong>Badges:</strong> {Array.isArray(user.badges) ? user.badges.length : 0}</p>
                </div>
            </div>

            <style jsx>{`
                .leader-card {
                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 12px;
                    width: 300px;
                    padding: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    backdrop-filter: blur(10px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    margin: 1.5rem;
                }

                .leader-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    justify-content: center;
                    gap: 10px;
                }

                .rank {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #3a3a3a;
                }

                .avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #fff;
                }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .name {
                    font-size: 1.4rem;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }

                .bio {
                    font-size: 0.9rem;
                    color: #555;
                    margin-bottom: 10px;
                    padding: 0 10px;
                }

                .info {
                    font-size: 1rem;
                    color: #777;
                    margin-top: 10px;
                }

                .info p {
                    margin: 5px 0;
                }
            `}</style>
        </div>
    );
}
