﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyChroniclesApi.Services;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MyChroniclesApi.Migrations.ChroniclesServiceMigrations
{
    [DbContext(typeof(ChroniclesService))]
    partial class ChroniclesServiceModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.AlternativeTitles", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("alternative_title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("chronicle_id")
                        .HasColumnType("uuid");

                    b.Property<string>("entertainment_category")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("producer")
                        .HasColumnType("text");

                    b.Property<string>("source")
                        .HasColumnType("text");

                    b.Property<int?>("year")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("chronicle_id");

                    b.ToTable("alternative_titles");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.Character", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("abilities")
                        .HasColumnType("text");

                    b.Property<string>("about")
                        .HasColumnType("text");

                    b.Property<int?>("age")
                        .HasColumnType("integer");

                    b.Property<string>("appearance")
                        .HasColumnType("text");

                    b.Property<string>("background")
                        .HasColumnType("text");

                    b.Property<string>("gender")
                        .HasColumnType("text");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("personality")
                        .HasColumnType("text");

                    b.Property<string>("social_connections")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("character");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.Chronicles", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("author")
                        .HasColumnType("text");

                    b.Property<string>("country")
                        .HasColumnType("text");

                    b.Property<DateTime?>("creation_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("db_add_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("entertainment_category")
                        .HasColumnType("text");

                    b.Property<int?>("episodes")
                        .HasColumnType("integer");

                    b.Property<string>("language")
                        .HasColumnType("text");

                    b.Property<int?>("length")
                        .HasColumnType("integer");

                    b.Property<string>("title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("chronicles");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.ChroniclesCast", b =>
                {
                    b.Property<Guid>("chronicle_id")
                        .HasColumnType("uuid")
                        .HasColumnOrder(1);

                    b.Property<Guid>("character_id")
                        .HasColumnType("uuid")
                        .HasColumnOrder(0);

                    b.Property<string>("notes")
                        .HasColumnType("text");

                    b.HasKey("chronicle_id", "character_id");

                    b.HasIndex("character_id");

                    b.ToTable("chronicles_cast");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.ChroniclesGenre", b =>
                {
                    b.Property<Guid>("chronicle_id")
                        .HasColumnType("uuid")
                        .HasColumnOrder(0);

                    b.Property<string>("genre")
                        .HasColumnType("text")
                        .HasColumnOrder(1);

                    b.HasKey("chronicle_id", "genre");

                    b.ToTable("chronicles_genre");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.ChroniclesTag", b =>
                {
                    b.Property<Guid>("chronicle_id")
                        .HasColumnType("uuid")
                        .HasColumnOrder(0);

                    b.Property<string>("tag")
                        .HasColumnType("text")
                        .HasColumnOrder(1);

                    b.HasKey("chronicle_id", "tag");

                    b.ToTable("chronicles_tag");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.AlternativeTitles", b =>
                {
                    b.HasOne("MyChroniclesApi.Models.Chronicles.Chronicles", "chronicles")
                        .WithMany()
                        .HasForeignKey("chronicle_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("chronicles");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.ChroniclesCast", b =>
                {
                    b.HasOne("MyChroniclesApi.Models.Chronicles.Character", "characters")
                        .WithMany()
                        .HasForeignKey("character_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MyChroniclesApi.Models.Chronicles.Chronicles", "chronicles")
                        .WithMany()
                        .HasForeignKey("chronicle_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("characters");

                    b.Navigation("chronicles");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.ChroniclesGenre", b =>
                {
                    b.HasOne("MyChroniclesApi.Models.Chronicles.Chronicles", "chronicles")
                        .WithMany()
                        .HasForeignKey("chronicle_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("chronicles");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Chronicles.ChroniclesTag", b =>
                {
                    b.HasOne("MyChroniclesApi.Models.Chronicles.Chronicles", "chronicles")
                        .WithMany()
                        .HasForeignKey("chronicle_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("chronicles");
                });
#pragma warning restore 612, 618
        }
    }
}
