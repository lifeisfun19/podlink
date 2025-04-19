"use client";
import CourseEditor from './components/courseEditor.js';
import EditProfileForm from './components/editProfileForm.js';
import './components/profile.css';

export default function ProfilePage() {
    return (
        <div className="page-wrapper">
            <EditProfileForm />
            <CourseEditor />
        </div>
    );
}
