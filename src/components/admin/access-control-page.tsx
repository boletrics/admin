"use client";

import { useState, useEffect, useCallback } from "react";
import {
	Shield,
	Users,
	Key,
	Plus,
	MoreHorizontal,
	CheckCircle,
	XCircle,
	Eye,
	Pencil,
	Ban,
	UserCheck,
	RefreshCw,
	UserX,
	Search,
	Loader2,
	AlertTriangle,
	LogOut,
	Clock,
	Monitor,
	Globe,
	Calendar,
	EyeOff,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
// Import directly from individual files to avoid server-only code in client bundle
import {
	listUsers,
	createUser,
	banUser,
	unbanUser,
	setUserRole,
	removeUser,
	revokeUserSessions,
	impersonateUser,
	stopImpersonating,
	listUserSessions,
	type AdminUser,
	type ListUsersResult,
} from "@/lib/auth/admin";
import { useAuthSession } from "@/lib/auth/useAuthSession";

// Session type for user sessions
type UserSession = {
	id: string;
	userId: string;
	token: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
	ipAddress?: string;
	userAgent?: string;
	impersonatedBy?: string;
};

// Ban expiration options in seconds
const BAN_EXPIRATION_OPTIONS = [
	{ label: "Permanente", value: 0 },
	{ label: "1 hora", value: 3600 },
	{ label: "24 horas", value: 86400 },
	{ label: "7 días", value: 604800 },
	{ label: "30 días", value: 2592000 },
	{ label: "90 días", value: 7776000 },
] as const;

const roleConfig: Record<
	string,
	{ label: string; color: string; description: string }
> = {
	admin: {
		label: "Admin",
		color:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
		description: "Full administrative access",
	},
	user: {
		label: "User",
		color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
		description: "Standard user access",
	},
};

export function AccessControlPage() {
	// Auth session for impersonation detection
	const { data: session } = useAuthSession();
	const isImpersonating = !!session?.session?.impersonatedBy;

	// State
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("all");

	// Dialog states
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [banDialogOpen, setBanDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [roleDialogOpen, setRoleDialogOpen] = useState(false);
	const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

	// Sessions state
	const [userSessions, setUserSessions] = useState<UserSession[]>([]);
	const [isLoadingSessions, setIsLoadingSessions] = useState(false);

	// Form states
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isStoppingImpersonation, setIsStoppingImpersonation] = useState(false);
	const [newUser, setNewUser] = useState({
		email: "",
		password: "",
		name: "",
		role: "user" as "user" | "admin",
	});
	const [banReason, setBanReason] = useState("");
	const [banExpiration, setBanExpiration] = useState(0);
	const [newRole, setNewRole] = useState<"user" | "admin">("user");

	// Fetch users
	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		try {
			const result = await listUsers({
				searchValue: searchQuery || undefined,
				searchField: "email",
				searchOperator: "contains",
				limit: 100,
				filterField: roleFilter !== "all" ? "role" : undefined,
				filterValue: roleFilter !== "all" ? roleFilter : undefined,
				filterOperator: "eq",
			});

			if (result.error) {
				toast.error("Error al cargar usuarios", {
					description: result.error,
				});
				return;
			}

			const data = result.data as ListUsersResult;
			setUsers(data.users || []);
			setTotalUsers(data.total || 0);
		} catch {
			toast.error("Error al cargar usuarios");
		} finally {
			setIsLoading(false);
		}
	}, [searchQuery, roleFilter]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Create user handler
	const handleCreateUser = async () => {
		if (!newUser.email || !newUser.password || !newUser.name) {
			toast.error("Todos los campos son requeridos");
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await createUser({
				email: newUser.email,
				password: newUser.password,
				name: newUser.name,
				role: newUser.role,
			});

			if (result.error) {
				toast.error("Error al crear usuario", { description: result.error });
				return;
			}

			toast.success("Usuario creado exitosamente");
			setCreateDialogOpen(false);
			setNewUser({ email: "", password: "", name: "", role: "user" });
			fetchUsers();
		} finally {
			setIsSubmitting(false);
		}
	};

	// Ban user handler
	const handleBanUser = async () => {
		if (!selectedUser) return;

		setIsSubmitting(true);
		try {
			const result = await banUser({
				userId: selectedUser.id,
				banReason: banReason || undefined,
				banExpiresIn: banExpiration > 0 ? banExpiration : undefined,
			});

			if (result.error) {
				toast.error("Error al banear usuario", { description: result.error });
				return;
			}

			toast.success("Usuario baneado exitosamente");
			setBanDialogOpen(false);
			setBanReason("");
			setBanExpiration(0);
			setSelectedUser(null);
			fetchUsers();
		} finally {
			setIsSubmitting(false);
		}
	};

	// Unban user handler
	const handleUnbanUser = async (user: AdminUser) => {
		try {
			const result = await unbanUser(user.id);

			if (result.error) {
				toast.error("Error al desbanear usuario", {
					description: result.error,
				});
				return;
			}

			toast.success("Usuario desbaneado exitosamente");
			fetchUsers();
		} catch {
			toast.error("Error al desbanear usuario");
		}
	};

	// Set role handler
	const handleSetRole = async () => {
		if (!selectedUser) return;

		setIsSubmitting(true);
		try {
			const result = await setUserRole({
				userId: selectedUser.id,
				role: newRole,
			});

			if (result.error) {
				toast.error("Error al cambiar rol", { description: result.error });
				return;
			}

			toast.success("Rol actualizado exitosamente");
			setRoleDialogOpen(false);
			setSelectedUser(null);
			fetchUsers();
		} finally {
			setIsSubmitting(false);
		}
	};

	// Remove user handler
	const handleRemoveUser = async () => {
		if (!selectedUser) return;

		setIsSubmitting(true);
		try {
			const result = await removeUser(selectedUser.id);

			if (result.error) {
				toast.error("Error al eliminar usuario", { description: result.error });
				return;
			}

			toast.success("Usuario eliminado exitosamente");
			setDeleteDialogOpen(false);
			setSelectedUser(null);
			fetchUsers();
		} finally {
			setIsSubmitting(false);
		}
	};

	// Revoke sessions handler
	const handleRevokeSessions = async (user: AdminUser) => {
		await handleRevokeSingleSession(user);
	};

	// Impersonate user handler
	const handleImpersonateUser = async (user: AdminUser) => {
		try {
			const result = await impersonateUser(user.id);

			if (result.error) {
				toast.error("Error al suplantar usuario", {
					description: result.error,
				});
				return;
			}

			toast.success(`Suplantando a ${user.name}`, {
				description: "Recarga la página para ver los cambios",
			});
			// Reload to apply impersonation
			window.location.reload();
		} catch {
			toast.error("Error al suplantar usuario");
		}
	};

	// Stop impersonating handler
	const handleStopImpersonating = async () => {
		setIsStoppingImpersonation(true);
		try {
			const result = await stopImpersonating();

			if (result.error) {
				toast.error("Error al dejar de suplantar", {
					description: result.error,
				});
				return;
			}

			toast.success("Suplantación terminada", {
				description: "Volviendo a tu sesión original",
			});
			// Reload to restore original session
			window.location.reload();
		} catch {
			toast.error("Error al dejar de suplantar");
		} finally {
			setIsStoppingImpersonation(false);
		}
	};

	// Fetch user sessions handler
	const handleFetchUserSessions = async (user: AdminUser) => {
		setSelectedUser(user);
		setSessionsDialogOpen(true);
		setIsLoadingSessions(true);

		try {
			const result = await listUserSessions(user.id);

			if (result.error) {
				toast.error("Error al cargar sesiones", {
					description: result.error,
				});
				setUserSessions([]);
				return;
			}

			setUserSessions((result.data as UserSession[]) || []);
		} catch {
			toast.error("Error al cargar sesiones");
			setUserSessions([]);
		} finally {
			setIsLoadingSessions(false);
		}
	};

	// Revoke single session and refresh the list
	const handleRevokeSingleSession = async (user: AdminUser) => {
		try {
			const result = await revokeUserSessions(user.id);

			if (result.error) {
				toast.error("Error al revocar sesiones", { description: result.error });
				return;
			}

			toast.success("Sesiones revocadas exitosamente");
			// Refresh sessions list if dialog is open
			if (sessionsDialogOpen && selectedUser?.id === user.id) {
				handleFetchUserSessions(user);
			}
		} catch {
			toast.error("Error al revocar sesiones");
		}
	};

	// Stats
	const adminCount = users.filter((u) => u.role === "admin").length;
	const bannedCount = users.filter((u) => u.banned).length;

	return (
		<div className="p-6 space-y-6">
			{/* Impersonation Banner */}
			{isImpersonating && (
				<Alert className="bg-amber-500/10 border-amber-500/50">
					<EyeOff className="h-4 w-4 text-amber-600" />
					<AlertDescription className="flex items-center justify-between">
						<span className="text-amber-700 dark:text-amber-400">
							<strong>Modo suplantación activo.</strong> Estás viendo el sistema
							como <span className="font-medium">{session?.user?.name}</span> (
							{session?.user?.email})
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={handleStopImpersonating}
							disabled={isStoppingImpersonation}
							className="ml-4 border-amber-500/50 hover:bg-amber-500/20"
						>
							{isStoppingImpersonation ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<LogOut className="h-4 w-4 mr-2" />
							)}
							Dejar de suplantar
						</Button>
					</AlertDescription>
				</Alert>
			)}

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Control de Acceso</h1>
					<p className="text-muted-foreground">
						Gestiona usuarios, roles y permisos del sistema
					</p>
				</div>
				<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Crear Usuario
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Crear Nuevo Usuario</DialogTitle>
							<DialogDescription>
								Crea un nuevo usuario con acceso al sistema
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label>Nombre</Label>
								<Input
									placeholder="Juan Pérez"
									value={newUser.name}
									onChange={(e) =>
										setNewUser({ ...newUser, name: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Email</Label>
								<Input
									type="email"
									placeholder="usuario@ejemplo.com"
									value={newUser.email}
									onChange={(e) =>
										setNewUser({ ...newUser, email: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Contraseña</Label>
								<Input
									type="password"
									placeholder="••••••••"
									value={newUser.password}
									onChange={(e) =>
										setNewUser({ ...newUser, password: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Rol</Label>
								<Select
									value={newUser.role}
									onValueChange={(value: "user" | "admin") =>
										setNewUser({ ...newUser, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="user">Usuario</SelectItem>
										<SelectItem value="admin">Administrador</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setCreateDialogOpen(false)}
							>
								Cancelar
							</Button>
							<Button onClick={handleCreateUser} disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								Crear Usuario
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Total Usuarios</CardDescription>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalUsers}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Administradores</CardDescription>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{adminCount}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Usuarios Regulares</CardDescription>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalUsers - adminCount}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardDescription>Usuarios Baneados</CardDescription>
						<Ban className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-destructive">
							{bannedCount}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Users Table */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<CardTitle>Usuarios del Sistema</CardTitle>
							<CardDescription>
								Gestiona todos los usuarios registrados
							</CardDescription>
						</div>
						<div className="flex flex-col sm:flex-row gap-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Buscar por email..."
									className="pl-9 w-full sm:w-[250px]"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<Select value={roleFilter} onValueChange={setRoleFilter}>
								<SelectTrigger className="w-full sm:w-[150px]">
									<SelectValue placeholder="Filtrar por rol" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos los roles</SelectItem>
									<SelectItem value="admin">Administradores</SelectItem>
									<SelectItem value="user">Usuarios</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" size="icon" onClick={fetchUsers}>
								<RefreshCw
									className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
								/>
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : users.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No se encontraron usuarios
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Usuario</TableHead>
									<TableHead>Rol</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead>Registrado</TableHead>
									<TableHead className="w-[50px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-9 w-9">
													{user.image && <AvatarImage src={user.image} />}
													<AvatarFallback className="bg-primary/10">
														{user.name
															?.split(" ")
															.map((n) => n[0])
															.join("") || user.email[0].toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">
														{user.name || "Sin nombre"}
													</p>
													<p className="text-xs text-muted-foreground">
														{user.email}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												className={
													roleConfig[user.role || "user"]?.color ||
													roleConfig.user.color
												}
											>
												{roleConfig[user.role || "user"]?.label || "Usuario"}
											</Badge>
										</TableCell>
										<TableCell>
											{user.banned ? (
												<Badge variant="destructive">
													<XCircle className="h-3 w-3 mr-1" />
													Baneado
												</Badge>
											) : user.emailVerified ? (
												<Badge
													variant="outline"
													className="text-emerald-600 border-emerald-600"
												>
													<CheckCircle className="h-3 w-3 mr-1" />
													Verificado
												</Badge>
											) : (
												<Badge variant="secondary">
													<AlertTriangle className="h-3 w-3 mr-1" />
													Pendiente
												</Badge>
											)}
										</TableCell>
										<TableCell className="text-muted-foreground">
											{user.createdAt
												? new Date(user.createdAt).toLocaleDateString("es-MX")
												: "—"}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => {
															setSelectedUser(user);
															setNewRole(
																(user.role as "user" | "admin") || "user",
															);
															setRoleDialogOpen(true);
														}}
													>
														<Pencil className="h-4 w-4 mr-2" />
														Cambiar Rol
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleFetchUserSessions(user)}
													>
														<Monitor className="h-4 w-4 mr-2" />
														Ver Sesiones
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleRevokeSessions(user)}
													>
														<Key className="h-4 w-4 mr-2" />
														Revocar Sesiones
													</DropdownMenuItem>
													{user.role !== "admin" && (
														<DropdownMenuItem
															onClick={() => handleImpersonateUser(user)}
														>
															<Eye className="h-4 w-4 mr-2" />
															Suplantar Usuario
														</DropdownMenuItem>
													)}
													<DropdownMenuSeparator />
													{user.banned ? (
														<DropdownMenuItem
															onClick={() => handleUnbanUser(user)}
														>
															<UserCheck className="h-4 w-4 mr-2" />
															Desbanear
														</DropdownMenuItem>
													) : (
														<DropdownMenuItem
															onClick={() => {
																setSelectedUser(user);
																setBanDialogOpen(true);
															}}
														>
															<Ban className="h-4 w-4 mr-2" />
															Banear
														</DropdownMenuItem>
													)}
													<DropdownMenuItem
														className="text-destructive"
														onClick={() => {
															setSelectedUser(user);
															setDeleteDialogOpen(true);
														}}
													>
														<UserX className="h-4 w-4 mr-2" />
														Eliminar
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Roles Info */}
			<Card>
				<CardHeader>
					<CardTitle>Roles del Sistema</CardTitle>
					<CardDescription>
						Roles disponibles y sus permisos asociados
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{Object.entries(roleConfig).map(([roleId, config]) => (
							<div
								key={roleId}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center gap-4">
									<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
										<Shield className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h4 className="font-medium">{config.label}</h4>
										<p className="text-sm text-muted-foreground">
											{config.description}
										</p>
									</div>
								</div>
								<Badge className={config.color}>{roleId}</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Ban Dialog */}
			<AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Banear Usuario</AlertDialogTitle>
						<AlertDialogDescription>
							¿Estás seguro de que deseas banear a {selectedUser?.name}? El
							usuario no podrá iniciar sesión.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Razón del baneo (opcional)</Label>
							<Textarea
								placeholder="Describe la razón del baneo..."
								value={banReason}
								onChange={(e) => setBanReason(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>Duración del baneo</Label>
							<Select
								value={banExpiration.toString()}
								onValueChange={(value) => setBanExpiration(parseInt(value))}
							>
								<SelectTrigger>
									<SelectValue placeholder="Seleccionar duración" />
								</SelectTrigger>
								<SelectContent>
									{BAN_EXPIRATION_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value.toString()}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{banExpiration > 0 && (
								<p className="text-xs text-muted-foreground flex items-center gap-1">
									<Clock className="h-3 w-3" />
									El baneo expirará el{" "}
									{new Date(
										Date.now() + banExpiration * 1000,
									).toLocaleDateString("es-MX", {
										day: "numeric",
										month: "long",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							)}
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleBanUser}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isSubmitting && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							Banear Usuario
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
						<AlertDialogDescription>
							¿Estás seguro de que deseas eliminar a {selectedUser?.name}? Esta
							acción no se puede deshacer.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleRemoveUser}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isSubmitting && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							Eliminar Usuario
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Change Role Dialog */}
			<Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cambiar Rol</DialogTitle>
						<DialogDescription>
							Cambiar el rol de {selectedUser?.name}
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Label>Nuevo Rol</Label>
						<Select
							value={newRole}
							onValueChange={(value: "user" | "admin") => setNewRole(value)}
						>
							<SelectTrigger className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="user">Usuario</SelectItem>
								<SelectItem value="admin">Administrador</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleSetRole} disabled={isSubmitting}>
							{isSubmitting && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							Guardar Cambios
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* User Sessions Dialog */}
			<Dialog open={sessionsDialogOpen} onOpenChange={setSessionsDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Monitor className="h-5 w-5" />
							Sesiones de {selectedUser?.name}
						</DialogTitle>
						<DialogDescription>
							Visualiza y gestiona las sesiones activas del usuario
						</DialogDescription>
					</DialogHeader>
					<ScrollArea className="max-h-[400px]">
						{isLoadingSessions ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						) : userSessions.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								No hay sesiones activas para este usuario
							</div>
						) : (
							<div className="space-y-3">
								{userSessions.map((session, index) => (
									<div
										key={session.id}
										className="p-4 border rounded-lg space-y-2"
									>
										<div className="flex items-center justify-between">
											<Badge variant="outline" className="font-mono text-xs">
												Sesión #{index + 1}
											</Badge>
											{session.impersonatedBy && (
												<Badge
													variant="secondary"
													className="bg-amber-500/10 text-amber-600"
												>
													<EyeOff className="h-3 w-3 mr-1" />
													Suplantada
												</Badge>
											)}
										</div>
										<div className="grid grid-cols-2 gap-2 text-sm">
											<div className="flex items-center gap-2 text-muted-foreground">
												<Globe className="h-4 w-4" />
												<span className="truncate">
													{session.ipAddress || "IP no disponible"}
												</span>
											</div>
											<div className="flex items-center gap-2 text-muted-foreground">
												<Calendar className="h-4 w-4" />
												<span>
													{new Date(session.createdAt).toLocaleDateString(
														"es-MX",
														{
															day: "numeric",
															month: "short",
															hour: "2-digit",
															minute: "2-digit",
														},
													)}
												</span>
											</div>
										</div>
										{session.userAgent && (
											<p className="text-xs text-muted-foreground truncate">
												{session.userAgent}
											</p>
										)}
										<Separator />
										<div className="flex items-center justify-between text-xs">
											<span className="text-muted-foreground">
												Expira:{" "}
												{new Date(session.expiresAt).toLocaleDateString(
													"es-MX",
													{
														day: "numeric",
														month: "short",
														year: "numeric",
													},
												)}
											</span>
											<Badge
												variant={
													new Date(session.expiresAt) > new Date()
														? "default"
														: "destructive"
												}
												className="text-xs"
											>
												{new Date(session.expiresAt) > new Date()
													? "Activa"
													: "Expirada"}
											</Badge>
										</div>
									</div>
								))}
							</div>
						)}
					</ScrollArea>
					<DialogFooter className="flex-col sm:flex-row gap-2">
						<Button
							variant="outline"
							onClick={() => setSessionsDialogOpen(false)}
						>
							Cerrar
						</Button>
						{userSessions.length > 0 && selectedUser && (
							<Button
								variant="destructive"
								onClick={() => {
									handleRevokeSessions(selectedUser);
									setSessionsDialogOpen(false);
								}}
							>
								<Key className="h-4 w-4 mr-2" />
								Revocar Todas las Sesiones
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
