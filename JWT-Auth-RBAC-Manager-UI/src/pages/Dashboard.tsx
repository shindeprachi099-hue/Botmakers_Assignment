import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const publicQuery = useQuery({
    queryKey: ['public'],
    queryFn: authService.getPublicContent,
  });

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: authService.getUserContent,
    enabled: user?.role === 'USER' || user?.role === 'ADMIN',
  });

  const adminQuery = useQuery({
    queryKey: ['admin'],
    queryFn: authService.getAdminContent,
    enabled: user?.role === 'ADMIN',
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Public Content Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Public Content
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {publicQuery.isLoading ? (
                        <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                      ) : publicQuery.isError ? (
                        <span className="text-red-500">Error loading content</span>
                      ) : (
                        <span className="text-green-600">✓ Accessible</span>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* User Content Card */}
          {(user?.role === 'USER' || user?.role === 'ADMIN') && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">U</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        User Content
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {userQuery.isLoading ? (
                          <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                        ) : userQuery.isError ? (
                          <span className="text-red-500">Access denied</span>
                        ) : (
                          <span className="text-green-600">✓ Accessible</span>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Content Card */}
          {user?.role === 'ADMIN' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">A</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Admin Content
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {adminQuery.isLoading ? (
                          <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                        ) : adminQuery.isError ? (
                          <span className="text-red-500">Access denied</span>
                        ) : (
                          <span className="text-green-600">✓ Accessible</span>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Information
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user?.role === 'ADMIN'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;