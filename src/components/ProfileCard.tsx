import React from "react";

interface ProfileCardProps {
  image: string;
  name: string;
  email: string;
  id: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ image, name, email, id }) => {
  return (
    <div className="w-52 h-64 bg-white shadow-md rounded-3xl flex flex-col items-center justify-center p-4 text-center">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full object-cover"
      />

      <p className="mt-3 font-semibold text-gray-900">{name}</p>
      <p className="text-sm text-gray-500">{email}</p>

      <p className="text-sm font-medium mt-1">
        <span className="text-gray-600">ID:</span> {id}
      </p>
    </div>
  );
};

export default ProfileCard;
