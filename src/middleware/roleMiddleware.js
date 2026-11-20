/**
 * Role-based Authorization Middleware
 * Ensures that the authenticated user possesses the required role.
 * If user does not have required role, returns HTTP 403 Forbidden.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please authenticate first.'
      });
    }

    const hasRole = allowedRoles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase());

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Requires one of the following roles: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
};

/**
 * Convenience middleware specifically restricting access to admins.
 */
const adminOnly = authorize('admin');

module.exports = {
  authorize,
  adminOnly
};
