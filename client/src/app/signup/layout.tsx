export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen">
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <meta name="google-signin-client_id" content="22157941594-tbme1jgkhar5n40j978g8u25jb5tjptn.apps.googleusercontent.com"></meta>
            {children}
        </div>
    )
};
