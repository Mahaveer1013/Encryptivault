export default function WorkflowPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">PassiVault API Workflow</h1>
                    <p className="text-xl text-gray-600">Complete Security Architecture & API Documentation</p>
                </div>

                {/* Security Overview */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">🔐 Security Architecture Overview</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-green-600">Security Features</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    JWT-based authentication with httpOnly cookies
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    AES-256 encryption for password storage
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    PBKDF2 key derivation with salt
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    Rate limiting (15 requests/minute)
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    Google Drive backup integration
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    Deletion password protection
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-blue-600">Data Flow</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <ol className="space-y-2 text-sm text-gray-700">
                                    <li>1. User login → JWT token generation</li>
                                    <li>2. Middleware validates token on each request</li>
                                    <li>3. Passwords encrypted client-side before storage</li>
                                    <li>4. Data backed up to Google Drive automatically</li>
                                    <li>5. Deletion requires special password</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Endpoints */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">🚀 API Endpoints Workflow</h2>

                    {/* Authentication APIs */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-purple-600 mb-4">Authentication APIs</h3>

                        <div className="space-y-6">
                            {/* Login */}
                            <div className="border-l-4 border-purple-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">POST /api/auth/login</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> User authentication and session creation</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Input:</strong> email, password, rememberMe</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Validates user credentials against database</li>
                                        <li>• Checks if user is verified</li>
                                        <li>• Generates JWT token with user ID and email</li>
                                        <li>• Sets httpOnly cookie with secure flags</li>
                                        <li>• Returns user data (excluding password)</li>
                                    </ol>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="bg-green-50 p-3 rounded">
                                        <h5 className="font-semibold text-green-800">✅ Advantages</h5>
                                        <ul className="text-green-700 space-y-1">
                                            <li>• Secure cookie storage</li>
                                            <li>• Password hashing with bcrypt</li>
                                            <li>• Remember me functionality</li>
                                            <li>• User verification check</li>
                                        </ul>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded">
                                        <h5 className="font-semibold text-red-800">⚠️ Disadvantages</h5>
                                        <ul className="text-red-700 space-y-1">
                                            <li>• Single point of failure <span className="text-xs text-green-600">(But Google Drive is a good backup)</span> </li>
                                            <li>• No 2FA support <span className="text-xs text-green-600">(Prompts master password for every action)</span> </li>
                                            <li>• Limited session management <span className="text-xs text-green-600">(For High Security)</span> </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Logout */}
                            <div className="border-l-4 border-purple-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">GET /api/auth/logout</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> Session termination and cleanup</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Deletes authentication cookie</li>
                                        <li>• Redirects to login page</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Verify User */}
                            <div className="border-l-4 border-purple-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">GET /api/auth/verify-user</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> Validate current session and get user data</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Extracts JWT token from cookie</li>
                                        <li>• Verifies token signature</li>
                                        <li>• Fetches current user from database</li>
                                        <li>• Returns user data (excluding password)</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Folder Management APIs */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-blue-600 mb-4">📁 Folder Management APIs</h3>

                        <div className="space-y-6">
                            {/* Get Folders */}
                            <div className="border-l-4 border-blue-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">GET /api/folders</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> Retrieve user's password folders</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Security:</strong> Requires x-user-id header (set by middleware)</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Validates user ID from JWT token</li>
                                        <li>• Queries database for user's folders</li>
                                        <li>• Returns encrypted folder data</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Create Folder */}
                            <div className="border-l-4 border-blue-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">POST /api/folders</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> Create new password folder</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Input:</strong> name, salt, hashedKey</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Validates user ID and folder name</li>
                                        <li>• Checks for duplicate folder names</li>
                                        <li>• Stores encrypted folder data</li>
                                        <li>• Creates Google Drive backup</li>
                                    </ol>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="bg-green-50 p-3 rounded">
                                        <h5 className="font-semibold text-green-800">✅ Advantages</h5>
                                        <ul className="text-green-700 space-y-1">
                                            <li>• Automatic backup to Google Drive</li>
                                            <li>• Duplicate prevention</li>
                                            <li>• Encrypted folder keys</li>
                                        </ul>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded">
                                        <h5 className="font-semibold text-red-800">⚠️ Disadvantages</h5>
                                        <ul className="text-red-700 space-y-1">
                                            <li>• Depends on Google Drive API</li>
                                            <li>• No folder sharing</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Folder */}
                            <div className="border-l-4 border-blue-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">DELETE /api/folders/[id]</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> Delete password folder</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Security:</strong> Requires deletion password</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Validates deletion password</li>
                                        <li>• Confirms folder ownership</li>
                                        <li>• Removes from database</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Management APIs */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-green-600 mb-4">🔑 Password Management APIs</h3>

                        <div className="space-y-6">
                            {/* Get Passwords */}
                            <div className="border-l-4 border-green-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">GET /api/passwords?folder=[folderId]</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> Retrieve passwords from specific folder</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Security:</strong> Requires folder parameter and user validation</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Validates user ID and folder access</li>
                                        <li>• Returns encrypted password data</li>
                                        <li>• Client-side decryption required</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Create Password */}
                            <div className="border-l-4 border-green-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">POST /api/passwords</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> Store new password entry</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Input:</strong> site, username, encryptedPassword, iv, folder</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Validates user and folder access</li>
                                        <li>• Stores AES-encrypted password</li>
                                        <li>• Creates Google Drive backup</li>
                                        <li>• Returns password entry with ID</li>
                                    </ol>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="bg-green-50 p-3 rounded">
                                        <h5 className="font-semibold text-green-800">✅ Advantages</h5>
                                        <ul className="text-green-700 space-y-1">
                                            <li>• Client-side encryption</li>
                                            <li>• Automatic backup</li>
                                            <li>• IV-based encryption</li>
                                        </ul>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded">
                                        <h5 className="font-semibold text-red-800">⚠️ Disadvantages</h5>
                                        <ul className="text-red-700 space-y-1">
                                            <li>• No password strength validation</li>
                                            <li>• Limited metadata storage</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Password */}
                            <div className="border-l-4 border-green-500 pl-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">DELETE /api/passwords/[id]</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                                    <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> Remove password entry</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Security:</strong> Requires deletion password</p>
                                    <p className="text-sm text-gray-600 mb-2"><strong>Process:</strong></p>
                                    <ol className="text-xs text-gray-600 ml-4 space-y-1">
                                        <li>• Validates deletion password</li>
                                        <li>• Confirms password ownership</li>
                                        <li>• Removes from database</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Analysis */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">🛡️ Security Analysis</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-green-600 mb-4">Strengths</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>End-to-End Encryption:</strong> Passwords are encrypted client-side before transmission
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>Secure Authentication:</strong> JWT tokens with httpOnly cookies prevent XSS attacks
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>Rate Limiting:</strong> Prevents brute force attacks with 15 requests/minute limit
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>Backup System:</strong> Automatic Google Drive backup ensures data persistence
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>Deletion Protection:</strong> Special passwords required for destructive operations
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-red-600 mb-4">Vulnerabilities</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>No 2FA:</strong> Single-factor authentication only
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>Client-Side Key Management:</strong> Encryption keys stored in browser memory
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>Google Drive Dependency:</strong> Backup system depends on external service
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>No Audit Logging:</strong> No tracking of password access or modifications
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                                    <div>
                                        <strong>Limited Session Management:</strong> No ability to revoke sessions remotely
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">💡 Security Recommendations</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">Immediate Improvements</h3>
                            <ul className="space-y-2 text-sm text-blue-700">
                                <li>• Implement 2FA with TOTP</li>
                                <li>• Add audit logging</li>
                                <li>• Implement session management</li>
                                <li>• Add password strength validation</li>
                            </ul>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800 mb-3">Advanced Features</h3>
                            <ul className="space-y-2 text-sm text-green-700">
                                <li>• Hardware security module (HSM)</li>
                                <li>• Zero-knowledge architecture</li>
                                <li>• Biometric authentication</li>
                                <li>• Secure key escrow</li>
                            </ul>
                        </div>

                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-purple-800 mb-3">Infrastructure</h3>
                            <ul className="space-y-2 text-sm text-purple-700">
                                <li>• Implement API versioning</li>
                                <li>• Add request/response validation</li>
                                <li>• Implement proper error handling</li>
                                <li>• Add health check endpoints</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
