CREATE TABLE [dbo].[Usuarios] (
    [Id]                 UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [NombreUsuario]      NVARCHAR (50)    NOT NULL,
    [CorreoElectronico]  NVARCHAR (100)   NOT NULL,
    [PasswordHash]       NVARCHAR (256)   NOT NULL,
    [Activo]             BIT              DEFAULT ((1)) NOT NULL,
    [FechaCreacion]      DATETIME2 (7)    DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_Usuarios]             PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Usuarios_NombreUsuario] UNIQUE ([NombreUsuario]),
    CONSTRAINT [UQ_Usuarios_Correo]       UNIQUE ([CorreoElectronico])
);
